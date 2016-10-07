'use strict';

/** atom */
const CompositeDisposable = require('atom').CompositeDisposable;

/** package */
const config = require('./config');
const projectViewerView = require('./project-viewer-view');
const caches = require('./caches');
const form = require('./form');
const formView = require('./form-view');
const getModel = require('./utils').getModel;
const database = require('./utils').database;

const deactivate = function _deactivate () {
  this.disposables.dispose();
  let view = caches.get(this);

  if (view) {
    view.reset();
    atom.workspace.panelForItem(view).destroy();
  }
};

const activate = function _activate () {
  this.disposables = new CompositeDisposable(
    atom.commands.add(
      'atom-workspace',
      workspaceCommands.call(this)
    ),
    atom.commands.add(
      'project-viewer',
      coreCommands.call(this)
    ),
    atom.contextMenu.add(
      contextMenu.call(this)
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
    )
  );
};

const traverse = function _traverse (direction) {
  const selectionsUnfiltered = this.querySelectorAll(
    `li[is="project-viewer-list-nested-item"],
    li[is="project-viewer-list-item"]`
  );

  let selectionsFiltered = Array.from(selectionsUnfiltered).filter(
    selection => {
      let isVisible = true;
      let parent = selection.parentNode;
      while(!parent.classList.contains('panel-body')) {
        parent = parent.parentNode;
        if (!parent || parent.classList.contains('collapsed')) {
          selection.classList.remove('active');
          isVisible = false;
          break;
        }
      }
      return isVisible;
    }
  );

  let nextIdx = 0;

  selectionsFiltered.some(
    (selection, idx) => {
      if (selection.classList.contains('active')) {
        selection.classList.remove('active');
        nextIdx = direction === 'up' ? idx - 1 : idx + 1;
        return true;
      }
    }
  );

  if (direction === 'up' && nextIdx === -1) {
    nextIdx = selectionsFiltered.length - 1;
  }
  else if (
    (direction === 'down' && nextIdx === selectionsFiltered.length) ||
    direction === undefined
  ) {
    nextIdx = 0;
  }

  selectionsFiltered[nextIdx].classList.add('active');
};

const toggleCollapse = function _toggleCollapse (direction) {
  const selectedView = this.querySelector(
    'li[is="project-viewer-list-nested-item"].active'
  );

  if (!selectedView) { return false; }

  const model = caches.get(selectedView);

  if (!model) { return false; }

  if (model.type === 'group' && direction === '<-') {
    selectedView.classList.add('collapsed');
  }

  if (model.type === 'group' && direction === '->') {
    selectedView.classList.remove('collapsed');
  }
};

const commandSelect = function _commandSelect () {
  const activeView = this.querySelector(
    `li[is="project-viewer-list-nested-item"].active,
    li[is="project-viewer-list-item"].active`
  );

  if (!activeView) { return false; }

  const model = caches.get(activeView);

  if (!model) { return false; }

  const selectedView = this.querySelector(
    `li[is="project-viewer-list-item"].selected`
  );

  if (model.type === 'item' && selectedView) {
    selectedView.classList.remove('selected');
  }

  if (model.type === 'item') {
    activeView.classList.add('selected');
    activeView.openOnWorkspace();
  }
  else if (model.type === 'group') {
    activeView.classList.toggle('collapsed');
  }
};

const coreCommands = function _workspaceCommands () {
  return {
    'core:move-up': function () { return traverse.call(this, 'up'); },
    'core:move-down': function () { return traverse.call(this, 'down'); },
    'core:move-left': function () { return toggleCollapse.call(this, '<-') },
    'core:move-right': function () { return toggleCollapse.call(this, '->') },
    'core:confirm': function () { return commandSelect.call(this) }
  }
};

const workspaceCommands = function _workspaceCommands () {
  return {
    'project-viewer:toggle': toggle.bind(this),
    'project-viewer:autohide': commandAutohide.bind(this),
    'project-viewer:editor': editor.bind(this),
    'project-viewer:focus': commandFocus.bind(this)
  }
};

const contextMenu = function _contextMenu () {
  return {
    'project-viewer': [
      {
        command: 'project-viewer:editor',
        created: function (evt) {
          let model = getModel(evt.target);
          if (model) {
            this.label = `Create in ${model.name}...`;
          }
          else {
            this.label = `Create in root...`
          }
        },
        shouldDisplay: function (evt) {
          let model = getModel(evt.target);
          if (!model) { return true; }
          return model.type === 'item' ? false : true;
        }
      },
      {
        command: 'project-viewer:editor',
        created: function (evt) {
          let model = getModel(evt.target);
          if (model) {
            this.label = `Update ${model.name}...`
          }
        },
        shouldDisplay: function (evt) {
          let model = getModel(evt.target);
          if (!model) { return false; }
          return model ? true : false;
        }
      }
    ]
  };
};

const observeVisibilityOption = function _observeVisibilityOption (option) {
  if (option === 'Remember state') {
    const vActive = atom.config.get('project-viewer.visibilityActive');
    const view = caches.get(this);
    const panel = atom.workspace.panelForItem(view);
    (vActive && !panel.visible) ? panel.show() : null;
    atom.config.set('project-viewer.visibilityActive', panel.visible);
  }
};

const observeVisibilityActive = function _observeVisibilityActive (option) {
  const vOption = atom.config.get('project-viewer.visibilityOption');
  if (vOption === 'Display on startup') { return; }
  const view = caches.get(this);
  const panel = atom.workspace.panelForItem(view);
  option ? panel.show() : panel.hide();
};

const observePanelPosition = function _observePanelPosition (option) {
  let view = caches.get(this);
  let panel;
  if (!view) {
    view = projectViewerView.createView();
    view.initialize();
    caches.set(this, view);
    database.refresh();
    view.populate(database.retrieve());
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

const observeAutoHide = function _observeAutoHide (option) {
  if (option) {
    autoHide.call(this);
  }
};

const toggle = function _toggle () {
  let view = caches.get(this);

  if (!view) {
    return;
  }

  const panel = atom.workspace.panelForItem(view);
  panel.visible ? panel.hide() : panel.show();

  if (atom.config.get('project-viewer.visibilityOption') === 'Remember state') {
    atom.config.set('project-viewer.visibilityActive', panel.visible);
  }
};

const commandAutohide = function _commandAutohide () {
  autoHide.call(this);
};

const autoHide = function _autohide () {
  let view = caches.get(this);

  if (!view) {
    return;
  }

  view.autohide();
};

const clearActives = function _clearActives (item) {
  let activeView = item.querySelectorAll(
    `li[is="project-viewer-list-nested-item"].active,
    li[is="project-viewer-list-item"].active`
  );

  if (!activeView) { return null; }

  activeView = Array.from(activeView);

  activeView.forEach(active => active.classList.remove('active'))
};

const commandFocus = function _commandFocus () {
  const view = caches.get(this);
  if (!view) { return false; }
  const panel = atom.workspace.panelForItem(view);
  if (!panel) { return false; }
  const item = panel.getItem();
  if (!item) { return false; }
  item.focus();

  clearActives(item);

  const selectedView = item.querySelector(
    `li[is="project-viewer-list-nested-item"].selected,
    li[is="project-viewer-list-item"].selected`
  );
  if (selectedView) {
    selectedView.classList.add('active');
  }
  else {
    traverse.call(view);
  }

  item.onblur = clearActives.bind(null, item);
};

const editor = function _editor (evt) {
  let activePane = atom.workspace.getActivePane();
  let formModel = form.createModel();
  formModel.current = getModel(evt.target);
  let formItem = formView.createView(formModel);

  activePane.addItem(formItem);
  activePane.activateItem(formItem);
  formItem.render();

  activePane.onDidDestroy(() => {
    if (activePane.alive) {
      activePane.focus();
    }
    formItem.disposables.dispose();
  });
};

const projectViewerService = function _projectViewerService () {
  return {};
};

const provideStatusBar = function _provideStatusBar (/*service*/) {};

module.exports = {
  config,
  activate,
  deactivate,
  projectViewerService,
  provideStatusBar
};
