'use strict';

/* package */
const _caches = require('./caches');
const _constructor = require('./view-constructor');

const viewMethods = {
  destroy: function _destroy () {
    let listTree = this.querySelector('ul.list-tree');
    if (listTree) {
      while (listTree.firstChild) {
        listTree.removeChild(listTree.firstChild);
      }
    }
  },
  initialize: function _initialize () {
    this.setAttribute('tabindex', -1);

    let bodyPanel = document.createElement('div');
    bodyPanel.classList.add('panel-body');

    let listTree = document.createElement('ul');
    listTree.classList.add('list-tree', 'has-collapsable-children');

    let loadingPanel = document.createElement('div');
    loadingPanel.classList.add('loading-panel');
    let loadingSpan = document.createElement('span');
    loadingSpan.classList.add('loading', 'loading-spinner-small');

    loadingPanel.appendChild(loadingSpan);
    bodyPanel.appendChild(loadingPanel);
    bodyPanel.appendChild(listTree);

    this.appendChild(bodyPanel);
  },
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
    tagIs: 'project-viewer2'
  };
  return _constructor.createView(options, viewMethods, model);
};

module.exports = {
  createView: createView
};
