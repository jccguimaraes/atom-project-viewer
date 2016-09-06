'use strict';

/** atom */
const CompositeDisposable = require('atom').CompositeDisposable;

/** package */
const config = require('./config');
const projectViewerView = require('./project-viewer-view');
const caches = require('./caches');
const api = require('./api');

const deactivate = function _deactivate () {
  this.disposables.dispose();
  let view = caches.get(this);

  if (view) {
    view.destroy();
    atom.workspace.panelForItem(view).destroy();
  }
};

const activate = function _active () {
  this.disposables = new CompositeDisposable();

  this.disposables.add(
    atom.commands.add('atom-workspace', {
      'project-viewer:toggle-display': togglePanel.bind(this),
      'project-viewer:form-display': formDisplay.bind(this)
    }),
    atom.contextMenu.add(
      {
        'project-viewer2': [
          {
            label: 'Create...',
            command: 'project-viewer:form-display',
            shouldDisplay: function (evt) {
              let model = searchForModel(evt.target);
              return (model && model.type === 'item') ? false : true;
            }
          },
          {
            command: 'project-viewer:form-display',
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
    atom.config.onDidChange('project-viewer.visibilityState', (newValue) => {
      if (newValue === 'Remember state') {
        let view = caches.get(this);
        const panel = atom.workspace.panelForItem(view);
        atom.config.set('project-viewer.visibilityAction', panel.visible);
      }
    })
  );

  initialize.call(this);
  readDatabase.call(this);
};

const initialize = function _initialize () {
  let view = caches.get(this);

  if (!view) {
    view = projectViewerView.createView({});
    view.initialize();
    caches.set(this, view);
  }

  let visible = atom.config.get('project-viewer.visibilityAction');
  atom.workspace.addRightPanel({
      item: view,
      visible
  });
};

const togglePanel = function _togglePanel () {
  let view = caches.get(this);

  if (!view) {
    return;
  }

  const panel = atom.workspace.panelForItem(view);
  const visible = panel.visible;
  panel.visible ? panel.hide() : panel.show();

  if (atom.config.get('project-viewer.visibilityState') === 'Remember state') {
    atom.config.set('project-viewer.visibilityAction', panel.visible);
  }
};

const formDisplay = function _formDisplay (evt) {
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




function buildGroup (entry) {
  let groupModel = api.model.createGroup();

  Object.keys(entry).forEach(
    function (key) {
      groupModel[key] = entry[key];
    }
  );

  let groupView = api.view.createGroup(groupModel);
  groupView.initialize();
  groupView.render();
  return groupView;
}

function buildItem (entry) {
  let itemModel = api.model.createItem();

  itemModel.name = entry.name;
  itemModel.icon = entry.icon;
  itemModel.addPaths(entry.paths);

  let itemView = api.view.createItem(itemModel);
  itemView.initialize();
  itemView.render();
  return itemView;
}

function cycleEntries (entries, type, parent) {
  entries.forEach(function (entry) {
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
  });
}

const readDatabase = function _readDatabase () {
  let databasePromise = new Promise((resolve, reject) => {
    // TODO temporary
    window.setTimeout(function () {
      let database = require('./../spec/mocks/database.json');
      resolve.call(this, database);
    }, 100);
  });

  databasePromise.then((data) => {
    let view = caches.get(this);
    if (!view) {
      return;
    }
    cycleEntries(data.structure, null, view);
  });
};

module.exports = {
  config,
  activate,
  deactivate
};
