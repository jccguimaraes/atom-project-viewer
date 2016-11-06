'use strict';

const model = require('./_model');

const filename = 'project-viewer.json';
const version = '0.4.0';
const database = Object.create(null);
const store = [];

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
  try {
    atom.getStorageFolder().storeSync(filename, storeProcessed);
    return true;
  } catch (e) {
    return;
  }
};

/**
 * Loads the local database and processes it
 * @returns {Array} always returns the store
 */
const refresh = function _refresh (serialized) {

  if (
    !serialized ||
    !serialized.hasOwnProperty('structure') ||
    Array.isArray(serialized)
  ) {
    return store;
  }
  store.length = 0;
  serialized.structure.forEach(processRawDatabase);
  // else {
  //     oldRefresh();
  // }

  return store;
};

// const oldRefresh = function _oldRefresh () {
//     const data = atom.getStorageFolder().load(filename);
//
//     if (!data) {
//       update();
//       return store;
//     }
//
//     let keys = Object.keys(data);
//     if (
//       keys.length === 2 &&
//       data.hasOwnProperty('info') &&
//       data.hasOwnProperty('structure')
//     ) {
//       store.length = 0;
//       data.structure.forEach(processRawDatabase);
//     }
//     else {
//       store.length = 0;
//     }
// };

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

const deserialize = function _deserialize (data) {
  refresh(data);
};

const serialize = function _serialize () {
  const storeProcessed = {
    info: {
      version
    },
    structure: processStore(store)
  };
  return storeProcessed;
};

database.serialize = serialize;
database.deserialize = deserialize;
database.fetch = fetch;
database.update = update;
database.refresh = refresh;
database.moveTo = moveTo;
database.remove = remove;
database.addTo = addTo;

module.exports = database;
