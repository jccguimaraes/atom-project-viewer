'use strict';

/**
 * atom
 */
const CompositeDisposable = require('atom').CompositeDisposable;

/**
 * project-viewer
 */
const config = require('./_config');
const map = require('./_map');
const database = require('./_database');
const cleanConfig = require('./_common').cleanConfig;

const mainView = require('./_main-view');
// const groupView = require('./_group-view');
// const projectView = require('./_project-view');

/**
 */
const main = Object.create(null);

/**
 */
const serviceExposer = Object.create(null);

/**
 */
const activate = function _activate () {
    // clear old config settings (a bit of an hack)
    cleanConfig();
    database.refresh();

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
         'project-viewer.hideTitle',
         observeHideTitle.bind(this)
       ),
       atom.config.observe(
         'project-viewer.statusBar',
         observeStatusBar.bind(this)
       )
     );
};

/**
 */
const deactivate = function _deactivate () {
  if (this.disposables) {
    this.disposables.dispose();
  }

  let view = map.get(this);
  if (!view) { return; }
  let panel = atom.workspace.panelForItem(view);
  if (!panel) { return; }
  view.reset();
  panel.destroy();
};

/**
 */
const projectViewerService = function _projectViewerService () {
  return serviceExposer;
};

/**
 */
const provideStatusBar = function _provideStatusBar (/*service*/) {};

/**
 */
const commandWorkspace = function _commandWorkspace () {
  return {
    'project-viewer:togglePanel': togglePanel.bind(this),
    'project-viewer:autohidePanel': autohidePanel.bind(this, undefined),
    'project-viewer:openForm': openForm.bind(this),
    'project-viewer:focusPanel': focusPanel.bind(this),
    'project-viewer:clearState': clearState.bind(this),
    'project-viewer:clearStates': clearStates.bind(this)
  }
};

/**
 */
const commandsCore = function _commandsCore () {
  return {
    'core:move-up': function () { return traverse.call(this, 'up'); },
    'core:move-down': function () { return traverse.call(this, 'down'); },
    'core:move-left': function () { return toggleSelected.call(this, '<-') },
    'core:move-right': function () { return toggleSelected.call(this, '->') },
    'core:confirm': function () { return toggleSelected.call(this) }
  }
};

/**
 */
const commandscontextMenu = function _commandscontextMenu () {
  return {};
};

/**
 */
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

/**
 */
const observeVisibilityActive = function observeVisibilityActive (option) {
  const vOption = atom.config.get('project-viewer.visibilityOption');
  if (vOption === 'Display on startup') { return; }
  const view = map.get(this);
  if (!view) { return; }
  const panel = atom.workspace.panelForItem(view);
  if (!panel) { return; }
  option ? panel.show() : panel.hide();
};

/**
 */
const observePanelPosition = function _observePanelPosition (option) {
  let view = map.get(this);
  let panel;
  if (!view) {
    view = mainView.createView();
    view.initialize();
    map.set(this, view);
    view.populate(database.fetch());
  } else {
    panel = atom.workspace.panelForItem(view);
  }

  if (panel) {
    panel.destroy();
  }

  if (option === 'Left' || option === 'Right') {
    atom.workspace[`add${option}Panel`]({
      item: view,
      visible: atom.config.get('project-viewer.visibilityActive')
    });
  }
};

/**
 */
const observeAutoHide = function _observeAutoHide (option) {
  autohidePanel.call(this, option);
};

/**
 */
const observeHideTitle = function _observeHideTitle (option) {
  let view = map.get(this);

  if (!view) { return; }

  view.toggleTitle(option);
};

/**
 */
const observeStatusBar = function _observeStatusBar (/*option*/) {

};

/**
 */
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

/**
 */
const autohidePanel = function _autohidePanel (option) {
  let view = map.get(this);

  if (!view) { return; }

  view.autohide(option);
};

/**
 */
const openForm = function _openForm () {};

/**
 */
const focusPanel = function _focusPanel () {
  const view = map.get(this);
  if (!view) { return false; }
  const panel = atom.workspace.panelForItem(view);
  if (!panel) { return false; }
  const item = panel.getItem();
  if (!item) { return false; }

  if (document.activeElement === item) {
    atom.workspace.getActivePane().activate();
    return;
  }

  item.focus();
};

/**
 */
const clearState = function _clearState () {};

/**
 */
const clearStates = function _clearStates () {};

/**
 */
const traverse = function _traverse () {};

/**
 */
const toggleSelected = function _toggleSelected () {};

/**
 * API
 */
const createGroup = function _createGroup () {
  // return groupView;
};

/**
 * API
 */
const createProject = function _createProject () {
  // return projectView;
};

/**
 * API
 */
serviceExposer.createGroup = createGroup;
serviceExposer.createProject = createProject;

/**
 * ATOM's lifecycle
 */
main.config = config;
main.activate = activate;
main.deactivate = deactivate;
main.projectViewerService = projectViewerService;
main.provideStatusBar = provideStatusBar;
main.traverse = traverse;
main.toggleSelected = toggleSelected;

/**
 */
module.exports = main;
