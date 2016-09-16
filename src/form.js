'use strict';

const database = require('./utils').database;

const methods = {
  getGroups: function _getGroups () {
    console.log(database.retrieve());
  },
  setters: function _setters (options) {
    // this.current = options;
    // addToDatabase(this.current);

    console.log(options);

    // type = Array.from(type).filter(
    //   (item) => item.checked
    // );
    //
    // if (paths) {
    //   paths = Array.from(paths).map(function (path) {
    //     return path.textContent;
    //   });
    // } else {
    //   paths = [];
    // }
    //
    // if (type.length === 1) {
    //   type = type[0].textContent;
    // }
    //
    // if (name) {
    //   name = name.getModel().getBuffer().getText();
    // }
    //
    // if (icon.hasOwnProperty('textContent')) {
    //   icon = icon.textContent;
    // }
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
