'use strict';

const fs = require('fs');
const path = require('path');

const model = require('./model');
const version = '1.0.0';
let sortBy;
const database = Object.create(null);
let store = [];
const file = 'project-viewer.json';
const filepath = path.join(atom.getConfigDirPath(), file);
let listeners = [];
let watcher;
let hasLocalFile = false;

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

/**
 * Maps each model to it's schema object
 * @returns {Undefined} cancel if entry has no type or type is not allowed
 * @since 1.0.0
 */
const processStorageEntry = function _processStorageEntry (reference, entry) {
  let prototypeOf = Object.getPrototypeOf(entry);
  let obj = {};

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
  fs.writeFile(filepath, JSON.stringify(content, null, 2));
};

/**
 * Updates the local database file with current content of the store
 * @public
 * @since 1.0.0
 */
const update = function _update () {
  const storeProcessed = {
    info: {
      version
    },
    root: processStore(store)
  };
  writeToDB(storeProcessed);
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
 * @public
 * @since 1.0.0
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
 * @param {Object} childModel - a model object of a group or a project that will
 *                              have it's prototype changed
 * @param {Object} protoModel - a model object of a group to be the new prototype
 * @return {Null|Boolean} Null if not moved and Boolean if success
 * @public
 * @since 1.0.0
 */
const moveTo = function _moveTo (childModel, protoModel) {
  const currentProtoModel = Object.getPrototypeOf(childModel);

  if (currentProtoModel === protoModel) { return null; }

  if (currentProtoModel.type && currentProtoModel.type !== 'group') {
    return null;
  }
  const oldIdx = store.indexOf(childModel);
  store.splice(oldIdx, 1);
  Object.setPrototypeOf(childModel, protoModel);
  store.push(childModel);
  return true;
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
 * Migrate old 0.3.x local database to 1.0.0
 * @since 1.0.0
 */
const migrate03x = function _migrate03x () {
  const store03x = atom.getStorageFolder().load(file);
  const convertedStore = [];

  function processGroup (group) {
    const groupModel = model.createGroup(group);
    convertedStore.push(groupModel);
    if (group.hasOwnProperty('groups')) {
      group.groups.forEach(processGroup.bind(null, groupModel));
    }
    if (group.hasOwnProperty('projects')) {
      group.projects.forEach(processProject.bind(null, groupModel));
    }
  }

  function processProject (parentModel, project) {
    const projectModel = model.createProject(project);
    convertedStore.push(projectModel);
    Object.setPrototypeOf(projectModel, parentModel);
  }

  store03x.clients.forEach(processGroup);
  store03x.groups.forEach(processGroup);
  store03x.projects.forEach(processProject);

  store = convertedStore;
  update();
  listeners.forEach(runSubscriber);
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

database.activate = activate;
database.deactivate = deactivate;
database.subscribe = subscribe;
database.fetch = fetch;
database.update = update;
database.refresh = refresh;
database.moveTo = moveTo;
database.remove = remove;
database.addTo = addTo;
database.openDatabase = openDatabase;
database.migrate03x = migrate03x;

/**
 * Database / Store module
 * @module database
 */
module.exports = database;
