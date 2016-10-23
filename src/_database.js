'use strict';

/**
 *
 */
const model = require('./_model');

/**
 *
 */
let store = [];

/**
 *
 */
const filename = 'pv040.json';
const version = '0.4.0';

/**
 *
 */
const database = Object.create(null);

/**
 *
 */
const processRawGroup = function _processRawGroup (list, protoModel, data) {
  if (!data) { return; }

  let groupModel = model.createGroup();
  Object.assign(groupModel, data);
  if (protoModel) {
    Object.setPrototypeOf(groupModel, protoModel);
  }
  list.push(groupModel);

  Array.prototype.concat(data.groups).forEach(
    processRawGroup.bind(null, list, groupModel)
  );
  Array.prototype.concat(data.projects).forEach(
    processRawProject.bind(null, list, groupModel)
  );
};

/**
 *
 */
const processRawProject = function _processRawProject (list, protoModel, data) {
  if (!data) { return; }

  let projectModel = model.createProject();
  Object.assign(projectModel, data);
  projectModel.addPaths(data.paths);

  if (protoModel) {
    Object.setPrototypeOf(projectModel, protoModel);
  }

  list.push(projectModel);
};

/**
 *
 */
const processRawDatabase = function _processRawDatabase (list, data) {
  if (!data) { return; }
  Array.prototype.concat(data.groups).forEach(
    processRawGroup.bind(null, list, undefined)
  );
  Array.prototype.concat(data.projects).forEach(
    processRawProject.bind(null, list, undefined)
  );
};

/**
 *
 */
const processStorageEntry = function _processStorageEntry (reference, entry) {
  let parentOf = Object.getPrototypeOf(entry);
  let obj = {};

  if (entry.type === 'group') {
    obj = model.createGroupSchema(entry);
    obj.groups = [];
    obj.projects = [];
  }
  else {
    obj = model.createProjectSchema(entry);
  }

  reference[entry.uuid] = obj;

  if (parentOf === Object.prototype) {
    this[`${entry.type}s`].push(obj);
  }
  else {
    let parentObj = reference[parentOf.uuid];
    parentObj[`${entry.type}s`].push(obj);
  }
};

/**
 *
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
 *
 */
const fetch = function _fetch () {
  return store;
};

/**
 *
 */
const update = function _update () {
  const storeProcessed = {
    info: {
      version
    },
    structure: processStore(store)
  };
  atom.getStorageFolder().storeSync(filename, storeProcessed);
};

/**
 *
 */
const refresh = function _refresh () {
  const rawData = atom.getStorageFolder().load(filename);
  let data;
  try {
    data = JSON.parse(rawData);
  } catch (e) {
    store = [];
    return store;
  }

  let keys = Object.keys(data);
  if (
    keys.length === 2 &&
    data.hasOwnProperty('info') &&
    data.hasOwnProperty('structure')
  ) {
    store = [];
    data.structure.forEach(processRawDatabase.bind(null, store));
  }
  else {
    store = [];
  }
  return store;
};

/**
 * Moves a model from one parent to another
 *
 * @param {object} childModel - a model object of a group or a project that will have it's prototype changed
 * @param {object} parentModel - a model object of a group to be the new prototype
 */
const moveTo = function _moveTo (childModel, parentModel) {
  const currentParentModel = Object.getPrototypeOf(childModel);

  if (currentParentModel === parentModel) { return null; }
  if (currentParentModel.type && currentParentModel.type !== 'group') {
      return null;
  }
  Object.setPrototypeOf(childModel, parentModel);
  return true;
};

/**
 * Removes a model from the store
 */
const remove = function _remove (model) {
    const idx = store.indexOf(model);
    if (idx === -1) {
        return null;
    }

    store.splice(idx, 1);
};

/**
 *
 */
database.fetch = fetch;
database.update = update;
database.refresh = refresh;
database.moveTo = moveTo;
database.remove = remove;

/**
 *
 */
module.exports = database;
