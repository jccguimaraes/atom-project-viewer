const {ipcRenderer} = require('electron');
const {CompositeDisposable} = require('atom');
const config = require('./config');
const map = require('./map');
const database = require('./database');
const colours = require('./colours');
const statusBar = require('./status-bar');
const mainView = require('./main-view');
const ProjectsList = require('./projects-list');
const {cleanConfig} = require('./common');
const {getModel} = require('./common');
const {getView} = require('./common');
const {getSelectedProject} = require('./common');
const githubWorker = new Worker(__dirname + '/workers/github.js');
const {shell} = require('electron');

let sidebarUnsubscriber;
// let selectListUnsubscriber;

const createProjectsListView = function () {
  if (!this.projectsListView) {
    this.projectsListView = new ProjectsList();
  }
  return this.projectsListView;
}

const checkIfOpened = function _checkIfOpened (event, model, title, action) {
  const paths = atom.project.getPaths();
  const opened = !paths.some(path => model.paths.indexOf(path) === -1);
  ipcRenderer.send(`channel-${model.uuid}`, model, title, opened, action);
};

const activate = function _activate () {

  ipcRenderer.on('pv-check-if-opened', checkIfOpened);

  // clear old config settings (a bit of an hack)
  cleanConfig();

  // activate database
  database.activate();

  database.subscribe(
    (models) => {
      const items = models.filter(function (model) {
        return model.type === 'project';
      });
      const projectsList = this.createProjectsListView();
      projectsList.update.call(projectsList, items);
    }
  )

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
      'project-viewer.dockOrPanel',
      observeDockOrPanel.bind(this)
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
    atom.config.onDidChange(
      'project-viewer.keepContext',
      observeKeepContext.bind(this)
    ),
    atom.config.observe(
      'project-viewer.autoHideAbsolute',
      observeAutoHideAbsolute.bind(this)
    ),
    atom.config.observe(
      'project-viewer.hideHeader',
      observeHideHeader.bind(this)
    ),
    atom.config.onDidChange(
      'project-viewer.customWidth',
      observeCustomWidth.bind(this)
    ),
    atom.config.onDidChange(
      'project-viewer.customHotZone',
      observeCustomHotZone.bind(this)
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
    ),
    atom.workspace.addOpener(uri => {
      if (uri === database.WORKSPACE_URI) {
        return map.get(this);
      }
      return null;
    })
  );

  showDisclaimer.call(this);
};

const showDisclaimer = function _showDisclaimer () {
  atom.packages.onDidActivatePackage(
      pkg => {
          if (pkg.name !== 'project-viewer') { return; }
          const pckv = `v${pkg.metadata.version.replace(/\D/g, '')}`;
          const confParam = `project-viewer.disclaimer.${pckv}`;

          if (atom.config.get(confParam)) {
            const versions = require('./json/release-notes.json');
            let disclaimer = [];
            for (let v in versions) { disclaimer.push(versions[v]); }
            const notification = atom.notifications.addInfo(
              `Project-Viewer - Release notes`,
              {
                description: disclaimer.join('\n\n'),
                icon: 'database',
                dismissable: true
              }
            );
            this.disposables.add(
              notification.onDidDismiss(
                () => atom.config.set(confParam, false)
              )
            );
          }
      }
  );
};

const deactivate = function _deactivate () {

  ipcRenderer.removeListener('pv-check-if-opened', checkIfOpened);

  if (this.disposables) {
    this.disposables.dispose();
  }

  let view = map.get(this);
  if (!view) { return; }
  let panel = atom.workspace.panelForItem(view);
  if (!panel) { return; }

  sidebarUnsubscriber();
  // selectListUnsubscriber();
  database.deactivate();
  colours.destroy();

  view.reset();
  panel.destroy();
};

const provideStatusBar = function _provideStatusBar (service) {
  map.set(statusBar, service);
  this.disposables.add(
    atom.config.observe(
      'project-viewer.statusBar',
      observeStatusBar.bind(this)
    )
  )
};

const consumeElementIcons = function _consumeElementIcons (func) {
  // console.log(func);
};

const commandWorkspace = function _commandWorkspace () {
  return {
    'project-viewer:togglePanel': togglePanel.bind(this),
    'project-viewer:autohidePanel': autohidePanel.bind(this, undefined),
    'project-viewer:openEditor': openEditor.bind(this),
    'project-viewer:openProject': openProject.bind(this),
    'project-viewer:focusPanel': focusPanel.bind(this),
    'project-viewer:toggleSelectList': toggleSelectList.bind(this),
    'project-viewer:openDatabase': openDatabase.bind(this),
    'project-viewer:migrate03x': migrate03x,
    'project-viewer:gistExport': gistExport,
    'project-viewer:gistImport': gistImport,
    'project-viewer:elevate-project': elevateProject.bind(this),
    'project-viewer:openProjectFolder': openProjectFolder,
    'project-viewer:deleteGroupOrProject': deleteGroupOrProject,
    'project-viewer:createNewGroup': createNewGroup.bind(this),
    'project-viewer:createNewProject': createNewProject.bind(this)
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
    '.tree-view': [
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
        command: 'project-viewer:deleteGroupOrProject',
        created: function (evt) {
          const model = getModel(evt.target);
          if (model) {
            this.label = `Delete ${model.name}...`;
          }
        },
        shouldDisplay: function (evt) {
          const view = getView(evt.target);
          return map.has(view);
        }
      },
      {
        command: 'project-viewer:createNewGroup',
        created: function (evt) {
          this.label = `Create new group...`;
        },
        shouldDisplay: function (evt) {
          const model = getModel(evt.target);
          return !model || (model && model.type === 'group');
        }
      },
      {
        command: 'project-viewer:createNewProject',
        created: function (evt) {
          this.label = `Create new project...`;
        },
        shouldDisplay: function (evt) {
          const model = getModel(evt.target);
          return !model || (model && model.type === 'group');
        }
      },
      {
        type: 'separator'
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
      },
      {
        command: 'project-viewer:openProjectFolder',
        created: function (evt) {
          this.label = 'Open local path(s)';
        },
        shouldDisplay: function (evt) {
          const model = getModel(evt.target);
          return model && model.type === 'project';
        }
      }
    ]
  };
};

const observeDockOrPanel = function _observeDockOrPanel (option) {
  // console.log('observeDockOrPanel', option);
};

const observeKeepContext = function _observeKeepContext (value) {
  if (!value.newValue) {
    database.KEEP_CONTEXT = true;
  }
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

  let container;
  let context;

  if (atom.config.get('project-viewer.dockOrPanel') && options.left) {
      context = atom.workspace.getLeftDock().paneContainer.getActivePane();
      container = context.addItem;
  }
  else if (atom.config.get('project-viewer.dockOrPanel') && options.right) {
      context = atom.workspace.getRightDock().paneContainer.getActivePane();
      container = context.addItem;
  }
  else if (!atom.config.get('project-viewer.dockOrPanel') && options.left) {
      context = atom.workspace;
      container = context.addLeftPanel;
  }
  else if (!atom.config.get('project-viewer.dockOrPanel') && options.right) {
      context = atom.workspace;
      container = context.addRightPanel;
  }

  container.call(context, !atom.config.get('project-viewer.dockOrPanel') ? panel : this);
  // container(atom.config.get('project-viewer.dockOrPanel') ? this : panel);

  if (options.left) {
    atom.workspace.addLeftPanel(panel);
  }

  // if (options.right) {
    // atom.workspace.addRightPanel(panel);
    // atom.workspace.getRightDock().paneContainer.getActivePane().addItem(
    // atom.workspace.open(
  //     this, {
  //     activatePane: true,
  //     activateItem: true,
  //     searchAllPanes: true
  //   });
  // }

  if (options.left) {
    this.invertResizer(true);
  }
  else {
    this.invertResizer(false);
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

  if (
    atom.config.get('project-viewer.autoHide') &&
    atom.config.get('project-viewer.autoHideAbsolute') &&
    option.startsWith('Left')
  ) {
    view.classList.add('position-left');
    view.classList.remove('position-right');
  }
  else if (
    atom.config.get('project-viewer.autoHide') &&
    atom.config.get('project-viewer.autoHideAbsolute') &&
    option.startsWith('Right')
  ) {
    view.classList.remove('position-left');
    view.classList.add('position-right');
  }
  else {
    view.classList.remove('position-left', 'position-right');
  }

  sidebarUnsubscriber = database.subscribe(view.populate.bind(view));
  database.refresh();
};

const observeAutoHide = function _observeAutoHide (option) {
  autohidePanel.call(this, option);
};

const observeAutoHideAbsolute = function _observeAutoHideAbsolute (option) {
  if (!atom.config.get('project-viewer.autoHide')) { return; }
  autohideAbsolutePanel.call(this, option);
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

const observeCustomWidth = function _observeCustomWidth (value) {
  colours.removeRule('app');
  colours.addRule('app', 'app', value.newValue);
};

const observeCustomHotZone = function _observeCustomHotZone (value) {
  let customHotZone = Math.min(
    atom.config.get('project-viewer.customWidth'),
    value.newValue
  );
  colours.removeRule('app');
  colours.addRule('hotzone', 'hotzone', customHotZone);
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

  if (!view) { return; }

  const panel = atom.workspace.panelForItem(view);

  if (!panel) { return; }

  panel.visible ? panel.hide() : panel.show();

  if (atom.config.get('project-viewer.visibilityOption') === 'Remember state') {
    atom.config.set('project-viewer.visibilityActive', panel.visible);
  }
};

const migrate03x = function _migrate03x () {
  database.migrate03x();
};

const toggleSelectList = function _toggleSelectList () {
  this.createProjectsListView().toggle();
};

const autohidePanel = function _autohidePanel (option) {
  const view = map.get(this);

  if (!view) { return; }

  view.autohide(option);
};

const autohideAbsolutePanel = function _autohideAbsolutePanel (option) {
  const view = map.get(this);

  if (!view) { return; }

  view.autoHideAbsolute(option);
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

const deleteGroupOrProject = function _deleteGroupOrProject (evt) {
  const model = getModel(evt.target);
  if (!model) { return; }
  database.remove(model);
  database.save();
};

const createNewGroup = function _createNewGroup (evt) {
  const model = getModel(evt.target) || Object.prototype;
  const view = map.get(this);
  if (!view) { return; }
  const newModel = {
    type: 'group',
    name: ''
  };
  Object.setPrototypeOf(newModel, model);
  view.openEditor(null, newModel);
};

const createNewProject = function _createNewProject (evt) {
  const model = getModel(evt.target) || Object.prototype;
  const view = map.get(this);
  if (!view) { return; }
  const newModel = {
    type: 'project',
    name: ''
  };
  Object.setPrototypeOf(newModel, model);
  view.openEditor(null, newModel);
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
    if (event.data.db.info && event.data.db.info.version) {
      database.importDB(event.data.db);
    }
    else {
      database.migrate03x(event.data.db);
    }
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

  view.openEditor(null, model);
};

const openProjectFolder = function _openProjectFolder (evt) {
    const model = getModel(evt.target);
    if (!model) { return; }
    model.paths.forEach(path => shell.showItemInFolder(path));
};

const main = Object.create(null);

main.activate = activate;
main.config = config;
main.deactivate = deactivate;
main.provideStatusBar = provideStatusBar;
main.consumeElementIcons = consumeElementIcons;
main.createProjectsListView = createProjectsListView;

/**
*/
module.exports = main;
