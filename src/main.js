'use strict';

const CompositeDisposable = require('atom').CompositeDisposable;
const config = require('./config');
const map = require('./map');
const database = require('./database');
const mainView = require('./main-view');
const selectList = require('./select-list-view');
const cleanConfig = require('./common').cleanConfig;

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
       observehideHeader.bind(this)
     ),
     atom.config.observe(
       'project-viewer.statusBar',
       observeStatusBar.bind(this)
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

  view.reset();
  panel.destroy();
};

const projectViewerService = function _projectViewerService () {
  return serviceExposer;
};

const provideStatusBar = function _provideStatusBar (/*service*/) {};

const commandWorkspace = function _commandWorkspace () {
  return {
    'project-viewer:togglePanel': togglePanel.bind(this),
    'project-viewer:autohidePanel': autohidePanel.bind(this, undefined),
    'project-viewer:openEditor': openEditor.bind(this),
    'project-viewer:focusPanel': focusPanel.bind(this),
    'project-viewer:toggleSelectList': toggleSelectList,
    'project-viewer:clearState': clearState.bind(this),
    'project-viewer:clearStates': clearStates.bind(this)
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
  return {};
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

  if (option === 'Left' || option === 'Right') {
    atom.workspace[`add${option}Panel`]({
      item: view,
      visible: atom.config.get('project-viewer.visibilityActive')
    });
  }

  sidebarUnsubscriber = database.subscribe(view.populate.bind(view));
  database.refresh();
};

const observeAutoHide = function _observeAutoHide (option) {
  autohidePanel.call(this, option);
};

const observehideHeader = function _observehideHeader (option) {
  let view = map.get(this);

  if (!view) { return; }

  view.toggleTitle(option);
};

const observeStatusBar = function _observeStatusBar () {};

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

const toggleSelectList = function _toggleSelectList () {
  selectList.togglePanel();
};

const autohidePanel = function _autohidePanel (option) {
  let view = map.get(this);

  if (!view) { return; }

  view.autohide(option);
};

const openEditor = function _openEditor () {
  const view = map.get(this);
  if (!view) { return; }
  view.openEditor();
};

const focusPanel = function _focusPanel () {
  const view = map.get(this);
  if (!view) { return false; }
  const panel = atom.workspace.panelForItem(view);
  if (!panel) { return false; }
  const item = panel.getItem();
  if (!item) { return false; }

  if (document.activeElement === item) {
    atom.workspace.getActivePane().activate();
    const selectedView = view.querySelector(
        `li[is="project-viewer-project"].active,
      li[is="project-viewer-project"].active`
    );
    if (selectedView) {
        selectedView.classList.remove('active');
    }
} else {
    const selectedView = view.querySelector(
      'li[is="project-viewer-project"].selected'
    );
    if (selectedView) {
        selectedView.classList.add('active');
    }
    item.focus();
}
};

const clearState = function _clearState () {};

const clearStates = function _clearStates () {};

const createGroup = function _createGroup () {};

const createProject = function _createProject () {};

const serviceExposer = Object.create(null);

serviceExposer.createGroup = createGroup;
serviceExposer.createProject = createProject;

const main = Object.create(null);

main.activate = activate;
main.config = config;
main.deactivate = deactivate;
main.projectViewerService = projectViewerService;
main.provideStatusBar = provideStatusBar;

/**
 */
module.exports = main;
