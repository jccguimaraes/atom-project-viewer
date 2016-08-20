'use strict';

const _caches = require('./caches');
const _constructor = require('./view-constructor');
const _api = require('./api');

const viewMethods = {
  createdCallback: function createdCallback () {
    let header = document.createElement('header');
    header.textContent = 'Project Viewer';
    this.appendChild(header);
  },
  attachedCallback: function attachedCallback () {},
  detachedCallback: function detachedCallback () {},
  initialize: function initialize () {},
  render: function render () {},
  sorting: function _sorting () {}
};

const createView = function _createView (model) {
  let options = {
    tagIs: 'project-viewer'
  };
  return _constructor.createView(options, viewMethods, model);
};

module.exports = {
  createView: createView
};
