'use strict';

const _caches = require('./caches');

const utils = {
  toArray: function _toArray (list, fnMap) {
    return Array.from(list, fnMap);
  },
  getModel: function _getModel (view) {
    return _caches.get(view);
  },
  getView: function _getView (model) {
    return document.body.querySelector(
      `li[data-project-viewer-uuid="${model.uuid}"]`
    );
  }
};

module.exports = utils;
