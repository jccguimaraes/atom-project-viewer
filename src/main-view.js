'use strict';

/* package */
const _caches = require('./caches');
const _constructor = require('./view-constructor');

const viewMethods = {
  initialize: function _initialize () {
    let listTree = document.createElement('ul');
    listTree.classList.add('list-tree', 'has-collapsable-children');
    this.appendChild(listTree);
  },
  render: function _render () {},
  attachChild: function _attachChild (node) {
    let listTree = this.querySelector('.list-tree');
    if (!listTree) {
      return;
    }
    listTree.appendChild(node);
  },
  detachChild: function _detachChild (node) {
    let listTree = this.querySelector('.list-tree');
    if (!listTree) {
      return;
    }
    listTree.removeChild(node);
  },
  sorting: function _sorting () {
    const model = _caches.get(this);

    if (!model) {
      return;
    }
    return model.name;
  }
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
