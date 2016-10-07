'use strict';

const caches = require('./caches');
const api = require('./api');

const references = {};

const generateModel = function _generateModel (list, root, method, candidate) {
  const entry = {
    groups: [],
    items: []
  };

  if (!root) {
    entry.model = api.model[method]();
    Object.assign(entry.model, candidate);
    if (candidate.hasOwnProperty('paths')) {
      entry.model.addPaths(candidate.paths);
    }
    entry.view = api.view[method](entry.model);
    entry.view.initialize();
    entry.view.render();
    references[entry.model.uuid] = entry.view;
  }

  if (candidate.hasOwnProperty('groups')) {
    cycleEntries(candidate.groups, entry.groups, false, 'createGroup');
  }
  if (candidate.hasOwnProperty('items')) {
    cycleEntries(candidate.items, entry.items, false, 'createItem');
  }

  list.push(entry);
};

const cycleEntries = function _cycleEntries (entries, list, root, method) {
  entries.forEach(generateModel.bind(this, list, root, method));
};

const database = {
  getComponentForId: function _getComponentForId (uuid) {
    const component = {
      view: references[uuid]
    };
    if (!component.view) { return null; }

    component.model = caches.get(component.view);
    return component;
  },
  refresh: function _refresh () {
    const data = atom.getStorageFolder().load('pv040.json');
    if (data) {
      const json = JSON.parse(data);

      if (!json.hasOwnProperty('structure')) { return; }
      if (!Array.isArray(json.structure)) { return; }

      const db = [];
      cycleEntries(json.structure, db, true);
      caches.set(this, db);
    }
    else {
      caches.set(this, undefined);
    }
  },
  retrieve: function _retrieve () {
    return caches.get(this);
  },
  update: function _update (changes) {
    if (!changes) { return; }
  }
};

module.exports = database;
