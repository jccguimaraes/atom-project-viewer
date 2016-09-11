'use strict';

const methods = {
  setters: function _setters (options) {
    this.current = options;
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
