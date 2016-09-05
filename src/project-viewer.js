'use strict';

/** atom */
const CompositeDisposable = require('atom').CompositeDisposable;

/** package */
const config = require('./config');
const mainView = require('./main-view');
const caches = require('./caches');

const deactivate = function _deactivate () {
  this.disposables.dispose();
  let viewMain = caches.get(this);

  if (viewMain) {
    atom.workspace.panelForItem(viewMain).destroy();
  }
};

const activate = function _active () {
  this.disposables = new CompositeDisposable();

  this.disposables.add(
    atom.commands.add('atom-workspace', {
      'project-viewer:form-display': formDisplay.bind(this)
    }),
    atom.contextMenu.add(
      {
        'project-viewer2': [
          {
            label: 'Update item...',
            command: 'project-viewer:form-display',
            shouldDisplay: function (evt) {
              const model = caches.get(evt.target);
              return model ? model.type === 'item' : false;
            }
          }
        ]
      }
    )
  );

  atom.config.observe('project-viewer.startupVisibility', (value) => {
    if (value) {
      let viewMain = caches.get(this);

      if (!viewMain) {
        viewMain = mainView.createView({});
        viewMain.initialize();
        caches.set(this, viewMain);
      }
      atom.workspace.addRightPanel({
          item: viewMain,
          visible: true
      });
    }
  });
};

// function buildGroup (entry) {
//   let groupModel = _api.model.createGroup();
//
//   Object.keys(entry).forEach(
//     function (key) {
//       groupModel[key] = entry[key];
//     }
//   );
//
//   let groupView = _api.view.createGroup(groupModel);
//   groupView.initialize();
//   groupView.render();
//   return groupView;
// }
//
// function buildItem (entry) {
//   let itemModel = _api.model.createItem();
//
//   itemModel.name = entry.name;
//   itemModel.icon = entry.icon;
//   itemModel.addPaths(entry.paths);
//
//   let itemView = _api.view.createItem(itemModel);
//   itemView.initialize();
//   itemView.render();
//   return itemView;
// }
//
// function cycleEntries (entries, type, parent) {
//   entries.forEach(function (entry) {
//     if (!parent) {
//       return;
//     }
//     let nextParent = parent;
//     if (type === 'group') {
//       nextParent = buildGroup(entry);
//       _api.ui.attach(nextParent, parent);
//     }
//     if (type === 'item') {
//       let item = buildItem(entry);
//       _api.ui.attach(item, parent);
//     }
//     if (entry.hasOwnProperty('groups')) {
//       cycleEntries(entry.groups, 'group', nextParent);
//     }
//     if (entry.hasOwnProperty('items')) {
//       cycleEntries(entry.items, 'item', nextParent);
//     }
//   });
// }
//
// const readDatabase = function _readDatabase (mainView) {
//   let databasePromise = new Promise(function (resolve, reject) {
//     // TODO temporary
//     window.setTimeout(function () {
//       let database = require('./../spec/mocks/database.json');
//       resolve(database);
//     }, 100);
//   });
//
//   databasePromise.then(function (data) {
//     cycleEntries(data, null, mainView);
//   });
// };

const formDisplay = function _formDisplay (evt) {
  let activePane = atom.workspace.getActivePane();
  let formModel = _api.model.createForm();
  formModel.current = caches.get(evt.target);
  let formItem = _api.view.createForm(formModel);

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

module.exports = {
  config,
  activate,
  deactivate
};
