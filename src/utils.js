'use strict';

const _caches = require('./caches');

const toArray = function _toArray (list, fnMap) {
  return Array.from(list, fnMap);
};

const getModel = function _getModel (view) {
  return _caches.get(view);
};

const getView = function _getView (model) {
  return document.body.querySelector(
    `li[data-project-viewer-uuid="${model.uuid}"]`
  );
};

exports.toArray = toArray;
exports.getModel = getModel;
exports.getView = getView;
