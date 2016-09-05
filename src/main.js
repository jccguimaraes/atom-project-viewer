'use strict';

/** atom */
const CompositeDisposable = require('atom').CompositeDisposable;

/** package */
const _mainView = require('./main-view');
const _api = require('./api');
const _caches = require('./caches');

const start = function _start () {
};

const destroy = function _destroy () {
  this.disposables.dispose();
  let mainView = _caches.get(this);

  if (mainView) {
    atom.workspace.panelForItem(mainView).destroy();
  }
};

const read_database = function _read_database () {
  let databasePromise = new Promise(function (resolve, reject) {
    // TODO temporary
    window.setTimeout(function () {
      let database = require('./../spec/mocks/database.json');
      resolve(database);
    }, 100);
  });
  return databasePromise;
};



const write_database = function _write_database () {};

module.exports = {
  start,
  destroy,
  read_database,
  write_database
};
