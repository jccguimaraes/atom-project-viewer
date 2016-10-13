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

const fetchOnlyTypes = function _fetchOnlyTypes (type, entries, list, nested) {
  Array.prototype.concat(entries.groups, entries.items).forEach(
    entry => {
      let obj = {
        model: entry.model,
        view: entry.view
      };
      let subList = [];
      if ((entry.model.type + 's') === type) {
        list.push(obj);
      }
      fetchOnlyTypes(type, entry, nested ? subList : list, nested);
      if (nested && subList.length > 0) {
        list.push(subList);
      }
    }
  );
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
  },
  getListOf: function _getListOf (listType, nested) {
    if (['groups', 'items'].indexOf(listType) === -1) { return null; }
    let db = this.retrieve();
    let list = [];
    fetchOnlyTypes(listType, db[0], list, nested);
    return list;
  }
};

module.exports = database;
