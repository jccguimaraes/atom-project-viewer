'use strict';

const getComponentForId = require('./utils').getComponentForId;
const retrieveDB = require('./utils').retrieveDB;
const utils = require('./common').utils;

const retrieveOnlyGroups = function _retrieveOnlyGroups (entries, list) {
  if (!Array.isArray(entries)) { return []; }
  entries.forEach(
    (entry) => {
      let group = {
        model: entry.model,
        list: []
      };
      if (entry.groups && entry.groups.length > 0) {
        retrieveOnlyGroups(entry.groups, group.list);
      }
      if (group.list.length === 0) { delete group.list; }
      list.push(group);
    }
  );
};

const methods = {
  getGroups: function _getGroups () {
    let db = retrieveDB();
    let groupsList = [];
    retrieveOnlyGroups(db[0].groups, groupsList);
    return groupsList;
  },
  submitter: function _submitter (options) {
    utils.updateDB({
           currentModel: options.model.current,
           currentParentModel: Object.getPrototypeOf(options.model.current),
           currentChanges: options.updates,
           newParentModel: getComponentForId(options.updates.parentUuid),
       });
  }
};

const model = {
  actions: {},
  current: {}
};

module.exports = {
  createModel: function _createModel () {
    return Object.setPrototypeOf(model, methods);
  },
};
