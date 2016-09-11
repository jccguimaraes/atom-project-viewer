'use strict';

/** atom */
const CompositeDisposable = require('atom').CompositeDisposable;

/** package */
const config = require('./config');
const projectViewerView = require('./project-viewer-view');
const caches = require('./caches');
const api = require('./api');
const constants = require('./constants');

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
    readDatabase.call(this);
    caches.set(this, view);
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

const editor = function _editor (evt) {
  let activePane = atom.workspace.getActivePane();
  let formModel = api.model.createForm();
  formModel.current = searchForModel(evt.target);
  let formItem = api.view.createForm(formModel);

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

const databaseThen = function _databaseThen (data) {
  let view = caches.get(this);
  if (!view) {
    return;
  }
  cycleEntries(data.structure, null, view);
};

const databaseCatch = function _databaseCatch (data) {
  atom.notifications.addWarning('Database', {
    description: data,
    icon: 'database'
  });
};

const databasePromise = function _databasePromise (resolve, reject) {
  const database = atom.getStorageFolder().load('pv040.json');
  database ?
    resolve(JSON.parse(database)) :
    reject(constants.database.rejected.message);
};

const readDatabase = function _readDatabase () {
  return new Promise(databasePromise.bind(this))
    .then(databaseThen.bind(this))
    .catch(databaseCatch.bind(this));
};








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

const buildGroup = function _buildGroup (entry) {
  let groupModel = api.model.createGroup();

  Object.assign(groupModel, entry);

  let groupView = api.view.createGroup(groupModel);
  groupView.initialize();
  groupView.render();
  return groupView;
};

const buildItem = function _buildItem (entry) {
  let itemModel = api.model.createItem();

  Object.assign(itemModel, entry);
  itemModel.addPaths(entry.paths);

  let itemView = api.view.createItem(itemModel);
  itemView.initialize();
  itemView.render();
  return itemView;
};

const filterEntries = function _filterEntries (type, parent, entry) {
  if (!parent) {
    return;
  }
  let nextParent = parent;
  if (type === 'group') {
    nextParent = buildGroup(entry);
    api.ui.attach(nextParent, parent);
  }
  if (type === 'item') {
    let item = buildItem(entry);
    api.ui.attach(item, parent);
  }
  if (entry.hasOwnProperty('groups')) {
    cycleEntries(entry.groups, 'group', nextParent);
  }
  if (entry.hasOwnProperty('items')) {
    cycleEntries(entry.items, 'item', nextParent);
  }
};

const cycleEntries = function _cycleEntries (entries, type, parent) {
  entries.forEach(filterEntries.bind(this, type, parent));
};

const projectViewerService = function _projectViewerService () {
  return {
    addGroup: function () {},
    addItem: function () {},
  };
};

const provideStatusBar = function _provideStatusBar (/*service*/) {};

module.exports = {
  config,
  activate,
  deactivate,
  projectViewerService,
  provideStatusBar
};
