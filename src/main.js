'use strict';

const CompositeDisposable = require('atom').CompositeDisposable;
const config = require('./config');
const map = require('./map');
const database = require('./database');
const colours = require('./colours');
const statusBar = require('./status-bar');
const mainView = require('./main-view');
const selectList = require('./select-list-view');
const cleanConfig = require('./common').cleanConfig;
const getModel = require('./common').getModel;
const getView = require('./common').getView;
const getSelectedProject = require('./common').getSelectedProject;
const githubWorker = new Worker(__dirname + '/workers/github.js');

let sidebarUnsubscriber;
let selectListUnsubscriber;

const activate = function _activate () {

  // clear old config settings (a bit of an hack)
  cleanConfig();

  // activate database
  database.activate();

  selectList.initialize();
  selectListUnsubscriber = database.subscribe(
    selectList.populate.bind(selectList)
  );

  colours.initialize();

  githubWorker.onmessage = githubWorkerOnMessage.bind(this);

  // add all disposables
  this.disposables = new CompositeDisposable(
    atom.commands.add(
      'atom-workspace',
      commandWorkspace.call(this)
    ),
    atom.commands.add(
      'project-viewer',
      commandsCore.call(this)
    ),
    atom.contextMenu.add(
      commandscontextMenu.call(this)
    ),
    atom.config.observe(
      'project-viewer.visibilityOption',
      observeVisibilityOption.bind(this)
    ),
    atom.config.observe(
      'project-viewer.visibilityActive',
      observeVisibilityActive.bind(this)
    ),
    atom.config.observe(
      'project-viewer.panelPosition',
      observePanelPosition.bind(this)
    ),
    atom.config.observe(
      'project-viewer.autoHide',
      observeAutoHide.bind(this)
    ),
    atom.config.observe(
      'project-viewer.hideHeader',
      observeHideHeader.bind(this)
    ),
    atom.config.onDidChange(
      'project-viewer.rootSortBy',
      observeRootSortBy.bind(this)
    ),
    atom.config.observe(
      'project-viewer.customTitleColor',
      observeCustomTitleColor.bind(this)
    ),
    atom.config.observe(
      'project-viewer.customHoverColor',
      observeCustomHoverColor.bind(this)
    ),
    atom.config.observe(
      'project-viewer.customSelectedColor',
      observeCustomSelectedColor.bind(this)
    ),
    atom.project.onDidChangePaths(
      observePathsChanges.bind(this)
    )
  );
};

const deactivate = function _deactivate () {
  if (this.disposables) {
    this.disposables.dispose();
  }

  let view = map.get(this);
  if (!view) { return; }
  let panel = atom.workspace.panelForItem(view);
  if (!panel) { return; }

  sidebarUnsubscriber();
  selectListUnsubscriber();
  database.deactivate();
  colours.destroy();

  view.reset();
  panel.destroy();
};

// const projectViewerService = function _projectViewerService () {
//   return serviceExposer;
// };

const provideStatusBar = function _provideStatusBar (service) {
  map.set(statusBar, service);
  this.disposables.add(
    atom.config.observe(
      'project-viewer.statusBar',
      observeStatusBar.bind(this)
    )
  )
};

const commandWorkspace = function _commandWorkspace () {
  return {
    'project-viewer:togglePanel': togglePanel.bind(this),
    'project-viewer:autohidePanel': autohidePanel.bind(this, undefined),
    'project-viewer:openEditor': openEditor.bind(this),
    'project-viewer:openProject': openProject.bind(this),
    'project-viewer:focusPanel': focusPanel.bind(this),
    'project-viewer:toggleSelectList': toggleSelectList,
    'project-viewer:clearState': clearState.bind(this),
    'project-viewer:clearStates': clearStates.bind(this),
    'project-viewer:openDatabase': openDatabase.bind(this),
    'project-viewer:migrate03x': migrate03x,
    'project-viewer:gistExport': gistExport,
    'project-viewer:gistImport': gistImport,
    'project-viewer:elevate-project': elevateProject.bind(this)
  }
};

const commandsCore = function _commandsCore () {
  return {
    'core:move-up': function () { return this.traverse.call(this, '☝️'); },
    'core:move-down': function () { return this.traverse.call(this, '👇'); },
    'core:move-left': function () { return this.setAction.call(this, '📪') },
    'core:move-right': function () { return this.setAction.call(this, '📭') },
    'core:confirm': function () { return this.setAction.call(this, '✅') }
  }
};

const commandscontextMenu = function _commandscontextMenu () {
  return {
    'ol.tree-view': [
      {
        type: 'separator'
      },
      {
        label: 'Elevate to Project...',
        command: 'project-viewer:elevate-project',
      },
      {
        type: 'separator'
      }
    ],
    'project-viewer': [
      {
        command: 'project-viewer:openEditor',
        created: function (evt) {
          const model = getModel(evt.target);
          if (model) {
            this.label = `Edit ${model.name}...`;
          }
        },
        shouldDisplay: function (evt) {
          const view = getView(evt.target);
          return map.has(view);
        }
      },
      {
        command: 'project-viewer:openProject',
        created: function (evt) {
          const model = getModel(evt.target);
          if (model && model.type === 'project') {
            const openIn = atom.config.get('project-viewer.openNewWindow') ?
            'in same window' : 'in a new window';
            this.label = `Open ${openIn}`;
          }
        },
        shouldDisplay: function (evt) {
          const model = getModel(evt.target);
          return model && model.type === 'project';
        }
      }
    ]
  };
};

const observeVisibilityOption = function _observeVisibilityOption (option) {
  if (option === 'Remember state') {
    const vActive = atom.config.get('project-viewer.visibilityActive');
    const view = map.get(this);
    if (!view) { return; }
    const panel = atom.workspace.panelForItem(view);
    if (!panel) { return; }
    (vActive && !panel.visible) ? panel.show() : null;
    atom.config.set('project-viewer.visibilityActive', panel.visible);
  }
};

const observeVisibilityActive = function observeVisibilityActive (option) {
  const vOption = atom.config.get('project-viewer.visibilityOption');
  if (vOption === 'Display on startup') { return; }
  const view = map.get(this);
  if (!view) { return; }
  const panel = atom.workspace.panelForItem(view);
  if (!panel) { return; }
  option ? panel.show() : panel.hide();
};

const buildPanel = function _buildPanel (options) {
  let panel = {
    item: this,
    visible: atom.config.get('project-viewer.visibilityActive')
  };

  if (options.priority) {
    panel.priority = 0;
  }

  if (options.left) {
    atom.workspace.addLeftPanel(panel);
  }

  if (options.right) {
    atom.workspace.addRightPanel(panel);
  }

  if (options.invertResizer) {
    this.invertResizer(true);
  }
};

const addPanel = function _addPanel (options) {
  if (atom.packages.getActivePackages().length > 0) {
    buildPanel.call(this, options);
    return;
  }
  atom.packages.onDidActivateInitialPackages(
    buildPanel.bind(this, options)
  );
};

const observePanelPosition = function _observePanelPosition (option) {
  let view = map.get(this);
  let panel;
  if (!view) {
    view = mainView.createView();
    view.initialize();
    map.set(this, view);
  } else {
    panel = atom.workspace.panelForItem(view);
  }

  if (panel) {
    panel.destroy();
    sidebarUnsubscriber();
  }

  if (option === 'Left (first)') {
    addPanel.call(view, { left: true, priority: true });
  }
  else if (option === 'Left (last)') {
    addPanel.call(view, { left: true });
  }
  else if (option === 'Right (first)') {
    addPanel.call(view, { right: true, priority: true });
  }
  else if (option === 'Right (last)') {
    addPanel.call(view, { right: true });
  }

  sidebarUnsubscriber = database.subscribe(view.populate.bind(view));
  database.refresh();
};

const observeAutoHide = function _observeAutoHide (option) {
  autohidePanel.call(this, option);
};

const observeHideHeader = function _observeHideHeader (option) {
  const view = map.get(this);
  if (!view) { return; }
  view.toggleTitle(option);
};

const observeCustomTitleColor = function _observeCustomTitleColor (value) {
  if (!value) {
    colours.removeRule('title');
    return;
  }
  colours.addRule('title', 'title', value);
};

const observeCustomHoverColor = function _observeCustomHoverColor (value) {
  if (!value) {
    colours.removeRule('projectHover');
    colours.removeRule('projectHoverBefore');
    return;
  }
  colours.addRule('projectHover', 'project-hover', value);
  colours.addRule('projectHoverBefore', 'project-hover-before', value);
};

const observeCustomSelectedColor = function _observeCustomSelectedColor (value) {
  if (!value) {
    colours.removeRule('projectSelected');
    return;
  }
  colours.addRule('projectSelected', 'project-selected', value);
};

const observeStatusBar = function _observeStatusBar (value) {
  statusBar.toggle.call(statusBar, value);
};

const observeRootSortBy = function _observeRootSortBy () {
  let view = map.get(this);
  if (!view) { return; }
  database.refresh();
};

const observePathsChanges = function _observePathsChanges (paths) {
  if (database.pathsChangedBypass) { return; }
  const selectedProject = getModel(getSelectedProject());
  if (!selectedProject) { return; }
  selectedProject.clearPaths();
  selectedProject.addPaths(paths);

};

const togglePanel = function _togglePanel () {
  let view = map.get(this);

  if (!view) {
    return;
  }

  const panel = atom.workspace.panelForItem(view);
  panel.visible ? panel.hide() : panel.show();

  if (atom.config.get('project-viewer.visibilityOption') === 'Remember state') {
    atom.config.set('project-viewer.visibilityActive', panel.visible);
  }
};

const migrate03x = function _migrate03x () {
  database.migrate03x();
};

const toggleSelectList = function _toggleSelectList () {
  selectList.togglePanel();
};

const autohidePanel = function _autohidePanel (option) {
  let view = map.get(this);

  if (!view) { return; }

  view.autohide(option);
};

const openProject = function _openProject (evt) {
  const view = getView(evt.target);
  if (!view) { return; }
  view.openOnWorkspace(true);
};

const openEditor = function _openEditor (evt) {
  const view = map.get(this);
  if (!view) { return; }
  const model = getModel(evt.target);
  view.openEditor(model);
};

const focusPanel = function _focusPanel () {
  const view = map.get(this);
  if (!view) { return false; }
  view.toggleFocus();
};

const openDatabase = function _openDatabase () {
  database.openDatabase();
};

const githubWorkerOnMessage = function _githubWorkerOnMessage (event) {
  if (!event.data) {
    atom.notifications.addError('Project Viewer - Github', {
      description: 'something\'s wrong with the web worker',
      icon: event.data.options.icon
    });
    return;
  }

  if (event.data.db) {
    database.importDB(event.data.db);
  }

  if (event.data.gistId) {
    atom.config.set('project-viewer.gistId', event.data.gistId);
  }

  atom.notifications[event.data.type]('Project Viewer - Github', {
    description: event.data.message,
    icon: event.data.options.icon
  });
};

const gistExport = function _gistExport () {
  githubWorker.postMessage([
    {
      action: 'update',
      token: atom.config.get('project-viewer.githubAccessToken'),
      gistId: atom.config.get('project-viewer.gistId'),
      setName: atom.config.get('project-viewer.setName'),
      value: database.exportDB()
    }
  ]);
};

const gistImport = function _gistImport () {
  githubWorker.postMessage([
    {
      action: 'fetch',
      token: atom.config.get('project-viewer.githubAccessToken'),
      gistId: atom.config.get('project-viewer.gistId'),
      setName: atom.config.get('project-viewer.setName')
    }
  ]);
};

const elevateProject = function _elevateProject () {
  const paths = atom.project.getPaths();
  const model = { type: 'project', paths };

  const view = map.get(this);
  if (!view) { return; }

  view.openEditor(model, true);
};

const clearState = function _clearState () {};

const clearStates = function _clearStates () {};

// const createGroup = function _createGroup () {};

// const createProject = function _createProject () {};

// const serviceExposer = Object.create(null);
//
// serviceExposer.createGroup = createGroup;
// serviceExposer.createProject = createProject;

const main = Object.create(null);

main.activate = activate;
main.config = config;
main.deactivate = deactivate;
// main.projectViewerService = projectViewerService;
main.provideStatusBar = provideStatusBar;

/**
*/
module.exports = main;
