'use strict';

/** atom */
const CompositeDisposable = require('atom').CompositeDisposable;

/** package */
const _config = require('./config');
const _mainView = require('./main-view');

module.exports = {
  config: _config,
  activate: function _active () {
    this.disposables = new CompositeDisposable();
    atom.workspace['addRightPanel']({
        item: _mainView.createView(),
        visible: true
    });
  },
  deactivate: function _deactivate () {
    this.disposables.dispose();
  },
  serialize: function _serialize () {}
};
