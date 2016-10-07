'use strict';

const database = require('./utils').database;

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
    let db = database.retrieve();
    let groupsList = [];
    retrieveOnlyGroups(db[0].groups, groupsList);
    return groupsList;
  },
  submitter: function _submitter (options) {
    console.log(options);

    if (options.groups) {
      console.log(
        database.getComponentForId(
          options.groupView.getAttribute('data-pv-uuid')
        ).model
      );
    }
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
