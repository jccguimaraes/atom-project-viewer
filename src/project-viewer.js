'use strict';

/** atom */
const CompositeDisposable = require('atom').CompositeDisposable;

/** package */
const _config = require('./config');
const _mainView = require('./main-view');
const _api = require('./api');

module.exports = {
  config: _config,
  activate: function _active () {
    this.disposables = new CompositeDisposable();

    let mainView = _mainView.createView({});
    mainView.initialize();
    mainView.render();

    let mainPanel = atom.workspace['addRightPanel']({
        item: mainView,
        visible: true
    });

    let group1Model = _api.model.createGroup();
    let group2Model = _api.model.createGroup();
    let group3Model = _api.model.createGroup();

    group1Model.name = 'group #1';
    group2Model.name = 'group #2';
    group3Model.name = 'group #3';

    let group1View = _api.view.createGroup(group1Model);
    let group2View = _api.view.createGroup(group2Model);
    let group3View = _api.view.createGroup(group3Model);

    group1View.initialize();
    group2View.initialize();
    group3View.initialize();

    group1View.render();
    group2View.render();
    group3View.render();

    mainView.attachChild(group1View);
    group1View.attachChild(group2View);
    group2View.attachChild(group3View);
  },
  deactivate: function _deactivate () {
    this.disposables.dispose();
  },
  serialize: function _serialize () {}
};
