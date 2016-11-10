'use strict';

const fs = require('fs');
const path = require('path');

const model = require('./model');
const version = '0.4.0';
const database = Object.create(null);
const store = [];
const file = 'project-viewer.json';
const filepath = path.join(atom.getConfigDirPath(), file);
let listeners = [];
let watcher;
let hasLocalFile = false;

/**
 * Maps each model to it's schema object
 * @returns {Undefined} cancel if entry has no type or type is not allowed
 */
const processStorageEntry = function _processStorageEntry (reference, entry) {
  let prototypeOf = Object.getPrototypeOf(entry);
  let obj = {};

  if (!entry.hasOwnProperty('type')) {
    return;
  }

  if (entry.type === 'group') {
    obj = model.createGroupSchema(entry);
    obj.groups = [];
    obj.projects = [];
  }
  else if (entry.type === 'project') {
    obj = model.createProjectSchema(entry);
  }
  else {
    return;
  }

  reference[entry.uuid] = obj;

  if (prototypeOf === Object.prototype) {
    this[`${entry.type}s`].push(obj);
    return;
  }
  let prototypeOfObj = reference[prototypeOf.uuid];
  if (!prototypeOfObj) { return; }

  prototypeOfObj[`${entry.type}s`].push(obj);
};

/**
 * Changes the current store to be an array with depth depending on each
 * entry model's prototype
 * @returns {Array} the storage array to be saved locally
 */
const processStore = function _processStore () {
  let storage = {
    groups: [],
    projects: []
  };
  const reference = {};
  store.forEach(processStorageEntry.bind(storage, reference));
  return [storage];
};

/**
 * Creates a group model from an object data
 *
 * @param {Object} protoModel - if exists, it's a referente to a group model
 * @param {Object} data - an object with a candidate to become a group
 */
const processRawGroup = function _processRawGroup (protoModel, data) {
  if (!data) { return; }

  let groupModel = model.createGroup();
  Object.assign(groupModel, data);

  addTo(groupModel, protoModel);

  Array.prototype.concat(data.groups).forEach(
    processRawGroup.bind(null, groupModel)
  );
  Array.prototype.concat(data.projects).forEach(
    processRawProject.bind(null, groupModel)
  );
};

/**
 * Creates a project model from an object data
 *
 * @param {Object} protoModel - if exists, it's a referente to a group model
 * @param {Object} data - an object with a candidate to become a project
 */
const processRawProject = function _processRawProject (protoModel, data) {
  if (!data) { return; }

  let projectModel = model.createProject();
  Object.assign(projectModel, data);
  projectModel.addPaths(data.paths);

  addTo(projectModel, protoModel);
};

/**
 * Start point to process the database object
 *
 * @param {Object} data - an object with the database object
 */
const processRawDatabase = function _processRawDatabase (data) {
  if (!data) { return; }
  Array.prototype.concat(data.groups).forEach(
    processRawGroup.bind(null, undefined)
  );
  Array.prototype.concat(data.projects).forEach(
    processRawProject.bind(null, undefined)
  );
};

/**
* Fetches the current store
* @returns {Array} the current store state
 */
const fetch = function _fetch () {
  return store;
};

/**
 *
 */
const writeToDB = function _writeToDB (content) {
  fs.writeFile(filepath, JSON.stringify(content, null, 2));
};

/**
 * Updates the local database file with current content of the store
 * @returns {Boolean|Undefined} true if success and undefined if error occurred
 */
const update = function _update () {
  const storeProcessed = {
    info: {
      version
    },
    structure: processStore(store)
  };
  writeToDB(storeProcessed);
};

/**
 * Processes the content retrieved from reading the file
 * @param {String} [result] the content that was retrieved in the file
 * @returns {Array} the store
 */
const processFileContent = function _processFileContent(result) {
    try {
        let serialized = JSON.parse(result);
        store.length = 0;
        serialized.structure.forEach(processRawDatabase);
        listeners.forEach(runSubscriber);
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
 */
 const refresh = function _refresh () {
   fs.readFile(filepath, 'utf8', function (err, data) {
     if (err) {
       atom.notifications.addWarning('Local database not found', {
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
 * @param {Object} childModel a model object of a group or a project that will have it's prototype changed
 * @param {Object} protoModel a model object of a group to be the new prototype
 * @return {Null|Boolean} Null if not moved and Boolean if success
 */
const moveTo = function _moveTo (childModel, protoModel) {
  const currentProtoModel = Object.getPrototypeOf(childModel);

  if (currentProtoModel === protoModel) { return null; }

  if (currentProtoModel.type && currentProtoModel.type !== 'group') {
      return null;
  }

  Object.setPrototypeOf(childModel, protoModel);

  return true;
};

/**
 * Removes a model from the store
 * @param {Object} model the model object to remove from the store
 * @returns {Null|Object} Undefined if model is an Array, the model if success
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
 * @param {Object} model the model object candidate to add to the store
 * @param {Object} protoModel group model object to be the prototype of model
 * @returns {Undefined|Boolean} Undefined if model is an Array, true if success
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

/**
 * ...
 * @param {Object} listener ...
 */
const runSubscriber = function _runSubscriber (listener) {
  listener(store);
};

/**
* ...
* @param {Object} listener ...
 */
const unsubscribe = function _unsubscribe (listener) {
  const idx = listeners.indexOf(listener);
  if (idx === -1) { return; }
  listeners.splice(idx, 1);
};

/**
* ...
* @param {Object} listener ...
 * @returns {Function} ...
 */
const subscribe = function _subscribe (listener) {
  if (listeners.indexOf(listener) !== -1) {
    return;
  }
  listeners.push(listener);
  console.log(listeners);
  return unsubscribe.bind(this, listener);
};

/**
 * Each watch notification passes through here where it validates if it was
 * a change or a rename/deletion.
 */
const directoryWatcher = function _directoryWatcher (event, filename) {
  if (filename !== file) {
    return;
  }
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
 */
const directoryUnwatch = function _directoryUnwatch () {
  if (!watcher) { return; }
  watcher.close();
};

/**
 * Watches for changes in the atom's config directory
 */
const directoryWatch = function _directoryWatch () {
  if (watcher) {
    watcher.close();
    watcher = undefined;
  }
  watcher = fs.watch(atom.getConfigDirPath(), directoryWatcher);
};

/**
 * Clears out the directory watch
 */
const deactivate = function _deactivate () {
    directoryUnwatch();
};

const activate = function _activate () {
    directoryWatch();
};

database.activate = activate;
database.deactivate = deactivate;
database.subscribe = subscribe;
database.unsubscribe = unsubscribe;
database.fetch = fetch;
database.update = update;
database.refresh = refresh;
database.moveTo = moveTo;
database.remove = remove;
database.addTo = addTo;

module.exports = database;
