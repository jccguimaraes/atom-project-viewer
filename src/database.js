const fs = require('fs');
const path = require('path');
const model = require('./model');

const PACKAGE_NAME = 'Project-Viewer';
const WORKSPACE_URI = 'atom://atom-project-viewer';
let KEEP_CONTEXT = false;

const version = '1.0.15';
const file = 'project-viewer.json';
const filepath = path.join(atom.getConfigDirPath(), file);
let store = [];
let listeners = [];
let watcher;
let hasLocalFile = false;

/**
 * Maps each model to it's schema object
 * @returns {Undefined} cancel if entry has no type or type is not allowed
 * @since 1.0.0
 */
const processStorageEntry = function _processStorageEntry (reference, entry) {
  let prototypeOf = Object.getPrototypeOf(entry);
  let obj;

  if (!entry.hasOwnProperty('type')) {
    return;
  }

  if (entry.type === 'group') {
    obj = model.createGroupSchema(entry);
    obj.list = [];
  }
  else if (entry.type === 'project') {
    obj = model.createProjectSchema(entry);
  }
  else {
    return;
  }

  reference[entry.uuid] = obj;

  if (prototypeOf === Object.prototype) {
    this.push(obj);
    return;
  }
  let prototypeOfObj = reference[prototypeOf.uuid];
  if (!prototypeOfObj) { return; }

  prototypeOfObj.list.push(obj);
};

/**
 * Changes the current store to be an array with depth depending on each
 * entry model's prototype
 * @returns {Array} the storage array to be saved locally
 * @since 1.0.0
 */
const processStore = function _processStore () {
  let storage = [];
  const reference = {};
  store.forEach(processStorageEntry.bind(storage, reference));
  return storage;
};

/**
 * Processes the listed model as a group or project
 * @param {Object} listed - a candidate to a model
 * @param {Object} parentModel - the model where the candidate will be placed
 * @since 1.0.0
 */
const processList = function _processList (parentModel, listed) {
  if (listed.type === 'group') {
      processGroup(parentModel, listed);
  }
  if (listed.type === 'project') {
      processProject(parentModel, listed);
  }
};

/**
 * Creates a group model from an object data
 * @param {Object} protoModel - if exists, it's a referente to a group model
 * @param {Object} data - an object with a candidate to become a group
 * @since 1.0.0
 */
const processGroup = function _processGroup (protoModel, data) {
  if (!data) { return; }
  let groupModel = model.createGroup(data);

  addTo(groupModel, protoModel);

  data.list.forEach(processList.bind(null, groupModel));
};

/**
 * Creates a project model from an object data
 * @param {Object} protoModel - if exists, it's a referente to a group model
 * @param {Object} data - an object with a candidate to become a project
 * @since 1.0.0
 */
const processProject = function _processProject (protoModel, data) {
  if (!data) { return; }
  let projectModel = model.createProject(data);
  addTo(projectModel, protoModel);
};

/**
 * Fetches the current store
 * @returns {Array} the current store state
 * @public
 * @since 1.0.0
 */
const fetch = function _fetch () {
  return store;
};

/**
 * Writes content to the local database file
 * @param {Object} content - The store content
 * @since 1.0.0
 */
const writeToDB = function _writeToDB (content) {
  fs.writeFile(
    filepath,
    JSON.stringify(content, null, 2),
    function writeToDBCallback (err) {
      if (err) {
        atom.notifications.addError('Local database corrupted', {
          detail: '😱! Something when wrong while writing to local file!',
          icon: 'database'
        });
      }
      setTimeout(directoryWatch, 1000);
    }
  );
};

/**
 * Updates the local database file with the current content of the store
 * @public
 * @since 1.0.0
 */
const save = function _save () {
  directoryUnwatch();
  writeToDB(exportDB());
  runSubscribers();
};

/**
 * Processes the content retrieved from reading the file
 * @param {String} result - the content that was retrieved in the file
 * @returns {Array} the store
 * @since 1.0.0
 */
const processFileContent = function _processFileContent(result) {
  try {
    let serialized = JSON.parse(result);
    store.length = 0;
    serialized.root.forEach(processList.bind(null, undefined));
    runSubscribers();
  } catch (e) {
    atom.notifications.addError('Local database corrupted', {
      detail: 'Please check the content of the local database',
      icon: 'database'
    });
  }
  return store;
}

/**
 * Loads the local database and processes it
 * @public
 * @since 1.0.0
 */
const refresh = function _refresh () {
  fs.readFile(filepath, 'utf8', function (err, data) {
    if (err) {
      atom.notifications.addWarning('Local database not found', {
        description: 'Please go to <strong>Packages -> Project Viewer -> Utilities -> Convert from 0.3.x local database</strong> if you come from a version previous to <strong>1.0.0</strong>',
        icon: 'database'
      });
      return;
    }
    hasLocalFile = true;
    processFileContent(data);
  });
};

/**
 * Moves a model from one prototype to another
 * @param {Object} childModel - a model object of a group or a project that will
 *                              have it's prototype changed
 * @param {Object} protoModel - a model object of a group to be the new prototype
 * @return {Null|Boolean} Null if not moved and Boolean if success
 * @public
 * @since 1.0.0
 */
const moveTo = function _moveTo (movingItem, targetedItem, insertBefore) {
    // this is basic stuff
    if (!movingItem || !targetedItem) { return; }

    // does this actually happen? as in a DnD action? :see_no_evil:
    if (movingItem === targetedItem) { return; }

    // if `isBefore` is `undefined` this means that we are moving an item
    // to the targetItem's list and not near it
    // and the targetItem must be a group
    if (insertBefore === undefined && targetedItem.type !== 'group') { return; }

    let prototypeOfmovingItem;

    // if `isBefore` is `undefined` this means that we are moving an item
    // to the targetItem's list and not near it
    if (insertBefore === undefined) {
        prototypeOfmovingItem = Object.getPrototypeOf(movingItem);
    }

    // does this actually happen? as in a DnD action? :see_no_evil:
    if (prototypeOfmovingItem === targetedItem) {
        return;
    }

    let movingItemIdx = store.indexOf(movingItem);
    const movingItems = [movingItem];

    store.slice(movingItemIdx + 1).some(
      storeItem => {
        const storeItemPrototype = Object.getPrototypeOf(storeItem);

        // this means that no more children of movingItem
        if (movingItems.indexOf(storeItemPrototype) === -1) {
          return true;
        }

        // add to the moving items array
        if (movingItems.indexOf(storeItem) === -1) {
          movingItems.push(storeItem);
        }

        // and we remove from the store
        store.splice(store.indexOf(storeItem), 1);

        // keep searching
        return false;
      }
    );

    store.splice(movingItemIdx, 1);

    let targetedItemIdx = store.indexOf(targetedItem);
    let targetedItems = [targetedItem];
    let lastTargetedChildIdx = targetedItemIdx;

    store.slice(targetedItemIdx + 1).some(
      storeItem => {
        const storeItemPrototype = Object.getPrototypeOf(storeItem);

        if (targetedItems.indexOf(storeItemPrototype) === -1) {
          // this means that no more children of targetedItem
          return true;
        }

        // get the last child's index in the current store
        // this is a substore so internal index reference is not valid
        lastTargetedChildIdx++;

        // add to the targeted items array
        if (targetedItems.indexOf(storeItem) === -1) {
          targetedItems.push(storeItem);
        }

        // keep searching
        return false;
      }
    );

    switch (insertBefore) {
      case undefined:
        store.splice(lastTargetedChildIdx + 1, 0, ...movingItems);
        Object.setPrototypeOf(movingItem, targetedItem);
        break;
      case true:
        store.splice(targetedItemIdx, 0, ...movingItems);
        Object.setPrototypeOf(movingItem, Object.getPrototypeOf(targetedItem));
        break;
      case false:
        store.splice(lastTargetedChildIdx + 1, 0, ...movingItems);
        Object.setPrototypeOf(movingItem, Object.getPrototypeOf(targetedItem));
        break;
    }
};

/**
 * Removes a model from the store
 * @param {Object} model - the model object to remove from the store
 * @returns {Null|Object} Undefined if model is an Array, the model if success
 * @public
 * @since 1.0.0
 */
const remove = function _remove (model) {
  const idx = store.indexOf(model);
  if (idx === -1) {
    return null;
  }
  const list = store.splice(idx, 1);

  if (list.length === 0) {
    return null;
  }

  return list[0];
};

/**
 * Add a model in the store
 * @param {Object} model - the model object candidate to add to the store
 * @param {Object} protoModel - group model object to be the prototype of model
 * @returns {Undefined|Boolean} Undefined if model is an Array, true if success
 * @public
 * @since 1.0.0
 */
const addTo = function _addTo (model, protoModel) {
  if (Array.isArray(model)) {
    model.forEach(
      entry => addTo.bind(entry, protoModel)
    );
    return;
  }

  if (protoModel && protoModel.type === 'project') { return; }

  if (protoModel) {
    Object.setPrototypeOf(model, protoModel);
  }

  store.push(model);

  return true;
};

const applyMigration03x = function _applyMigration03x (importedDB) {

    const store03x = importedDB || atom.getStorageFolder().load(file);

    if (!store03x) {
        atom.notifications.addInfo('Old database file not found!', {
          icon: 'database',
          description: 'Could not find any old database file!'
        });
        return;
    }

    const convertedStore = [];

    function processOldGroup (parentModel, group) {
      const groupModel = model.createGroup(group);
      convertedStore.push(groupModel);
      Object.setPrototypeOf(groupModel, parentModel);
      if (group.hasOwnProperty('groups')) {
        group.groups.forEach(processOldGroup.bind(null, groupModel));
      }
      if (group.hasOwnProperty('projects')) {
        group.projects.forEach(processOldProject.bind(null, groupModel));
      }
    }

    function processOldProject (parentModel, project) {
      const projectModel = model.createProject(project);
      convertedStore.push(projectModel);
      Object.setPrototypeOf(projectModel, parentModel);
    }

    store03x.clients.forEach(processOldGroup.bind(null, Object.prototype));
    store03x.groups.forEach(processOldGroup.bind(null, Object.prototype));
    store03x.projects.forEach(processOldProject.bind(null, Object.prototype));

    store = convertedStore;
    save();
    runSubscribers();
}

/**
 * Migrate old 0.3.x local database to 1.0.0
 * @since 1.0.0
 */
const migrate03x = function _migrate03x (importedDB) {
  if (store) {
    const notification = atom.notifications.addWarning('Local database found!', {
      icon: 'database',
      description: 'There is already an **active** database, are you sure you **want** to loose it?',
      dismissable: true,
      buttons: [
          {
              className: 'btn btn-error',
              onDidClick: function () {
                  notification.dismiss();
              },
              text: 'abort'
          },
          {
              className: 'btn btn-info',
              onDidClick: function () {
                  notification.dismiss();
                  applyMigration03x.call(this, importedDB);
              },
              text: 'continue'
          }
      ]
    });
  }
};

const importDB = function _importDB (importedDB) {
  writeToDB(importedDB);
};

const exportDB = function _exportDB () {
  const storeProcessed = {
    info: {
      version,
      updated: new Date()
    },
    root: processStore(store)
  };
  return storeProcessed;
};

/**
 * Deactivation of the database module
 * Clears out the directory watcher
 * @public
 * @since 1.0.0
 */
const deactivate = function _deactivate () {
  directoryUnwatch();
};

/**
 * Activation of the database module
 * Activates the directory watcher
 * @public
 * @since 1.0.0
 */
const activate = function _activate () {
  directoryWatch();
};

/**
 * Each watch notification passes through here where it validates if it was
 * a change or a rename/deletion.
 * @param {String} event - The event occured in the local database,
 *                         values are change and rename
 * @param {String} filename - The listener callback
 * @since 1.0.0
 */
const directoryWatcher = function _directoryWatcher (event, filename) {
  if (filename !== file) { return; }
  if (event === 'change') {
    refresh();
    return;
  }

  if (hasLocalFile) {
    hasLocalFile = false;
    atom.notifications.addError('Local database not found', {
      detail: 'it is possible that the file has been renamed or deleted',
      icon: 'database'
    });
  }
  else {
    atom.notifications.addSuccess('Local database found!', {
      icon: 'database'
    });
    hasLocalFile = true;
    refresh();
  }
};

/**
 * Unwatches for changes in the atom's config directory
 * @since 1.0.0
 */
const directoryUnwatch = function _directoryUnwatch () {
  if (!watcher) { return; }
  watcher.close();
};

/**
 * Watches for changes in the atom's config directory
 * @since 1.0.0
 */
const directoryWatch = function _directoryWatch () {
  if (watcher) {
    watcher.close();
    watcher = undefined;
  }
  watcher = fs.watch(atom.getConfigDirPath(), directoryWatcher);
};

/**
 * Runs a subscriber callback when a change in the store is made
 * @callback subscriber
 * @param {subscriber} listener - The listener callback
 * @since 1.0.0
 */
const runSubscriber = function _runSubscriber (listener) {
  listener(store);
};

/**
 * Runs all subscribers callback
 * @since 1.0.0
 */
const runSubscribers = function _runSubscribers () {
  listeners.forEach(runSubscriber);
};

/**
 * Unsubscribes the callback
 * @callback subscriber
 * @param {subscriber} listener - The listener callback
 * @public
 * @since 1.0.0
 */
const unsubscribe = function _unsubscribe (listener) {
  const idx = listeners.indexOf(listener);
  if (idx === -1) { return; }
  listeners.splice(idx, 1);
  return true;
};

/**
 * Subscribes the callback to be invoked on store changes
 * @callback subscriber
 * @param {subscriber} listener - The listener callback
 * @public
 * @since 1.0.0
 */
const subscribe = function _subscribe (listener) {
  if (listeners.indexOf(listener) !== -1) {
    return;
  }
  listeners.push(listener);
  return unsubscribe.bind(this, listener);
};

/**
 * Opens the local database file
 * @since 1.0.0
 */
const openDatabase = function _openDatabase () {
  atom.open({
    pathsToOpen: filepath,
    newWindow: false
  })
};

const database = Object.create(null);

database.pathsChangedBypass = false;
database.runSubscribers = runSubscribers;
database.subscribe = subscribe;
database.unsubscribe = unsubscribe;
database.openDatabase = openDatabase;

database.activate = activate;
database.deactivate = deactivate;
database.fetch = fetch;
database.save = save;
database.refresh = refresh;
database.moveTo = moveTo;
database.remove = remove;
database.addTo = addTo;
database.migrate03x = migrate03x;
database.importDB = importDB;
database.exportDB = exportDB;

database.PACKAGE_NAME = PACKAGE_NAME;
database.WORKSPACE_URI = WORKSPACE_URI;
database.KEEP_CONTEXT = KEEP_CONTEXT;

/**
 * Database / Store module
 * @module database
 */
module.exports = database;
