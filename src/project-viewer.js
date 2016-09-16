'use strict';

/** atom */
const CompositeDisposable = require('atom').CompositeDisposable;

/** package */
const config = require('./config');
const projectViewerView = require('./project-viewer-view');
const caches = require('./caches');
const form = require('./form');
const formView = require('./form-view');
const database = require('./utils').database;

// TODO remove?
const searchForModel = function _searchForModel (element) {
  let view = element;
  let model = caches.get(view);
  if (!model && view.parentNode.nodeName === 'LI') {
    model = caches.get(view.parentNode);
  }
  if (!model && view.parentNode.parentNode.nodeName === 'LI') {
    model = caches.get(view.parentNode.parentNode);
  }
  return model;
};

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
    atom.commands.add('atom-workspace', {
      'project-viewer:toggle': toggle.bind(this),
      'project-viewer:autohide': commandAutohide.bind(this),
      'project-viewer:editor': editor.bind(this)
    }),
    atom.contextMenu.add(
      {
        'project-viewer': [
          {
            command: 'project-viewer:editor',
            label: 'Create...',
            shouldDisplay: function (evt) {
              const model = searchForModel(evt.target);
              return (model && model.type === 'item') ? false : true;
            }
          },
          {
            command: 'project-viewer:editor',
            created: function (evt) {
              let model = searchForModel(evt.target);
              if (model) {
                this.label = `Update ${model.name}...`
              }
            },
            shouldDisplay: function (evt) {
              let model = searchForModel(evt.target);
              return model ? true : false;
            }
          }
        ]
      }
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

const editor = function _editor (evt) {
  let activePane = atom.workspace.getActivePane();
  let formModel = form.createModel();
  formModel.current = searchForModel(evt.target);
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
