'use strict';

const caches = require('./caches');
const database = require('./database');

const toArray = function _toArray (list, fnMap) {
  return Array.from(list, fnMap);
};

const getModel = function _getModel (view) {
  let model = caches.get(view);
  let safeCycle = 0;
  while (!model && safeCycle < 3) {
    view = view.parentNode;
    model = caches.get(view);
    safeCycle++;
  }
  return model;
};

const getView = function _getView (model) {
  return document.body.querySelector(
    `li[data-project-viewer-uuid="${model.uuid}"]`
  );
};

exports.toArray = toArray;
exports.getModel = getModel;
exports.getView = getView;
exports.database = database;
