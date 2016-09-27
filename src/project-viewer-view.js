'use strict';

/* package */
const caches = require('./caches');
const constructor = require('./constructor');

const cycleViews = function _cycleViews (parent, views) {
  if (views.view && parent && parent.attachChild) {
    parent.attachChild(views.view);
  }
  if (views.hasOwnProperty('groups')) {
    buildStructure(views.groups, views.view || parent);
  }
  if (views.hasOwnProperty('items')) {
    buildStructure(views.items, views.view || parent);
  }
};

const buildStructure = function _cycleStructure (list, parent) {
  list.forEach(cycleViews.bind(this, parent));
};

const viewMethods = {
  reset: function _reset () {
    let listTree = this.querySelector('ul.list-tree');
    if (listTree) {
      while (listTree.firstChild) {
        listTree.removeChild(listTree.firstChild);
      }
    }
  },
  populate: function _populate (structure) {
    if (!structure) {
      return;
    }
    this.reset();
    buildStructure(structure, this);
  },
  initialize: function _initialize () {
    this.setAttribute('tabindex', -1);

    let hiddenBlock = document.createElement('div');
    hiddenBlock.classList.add('hidden-block');

    let bodyPanel = document.createElement('div');
    bodyPanel.classList.add('panel-body');

    let listTree = document.createElement('ul');
    listTree.classList.add(
      'list-tree',
      'has-collapsable-children',
      'pv-has-custom-icons'
    );

    bodyPanel.appendChild(listTree);

    this.appendChild(hiddenBlock);
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
    const model = caches.get(this);

    if (!model) {
      return;
    }
    return model.name;
  },
  autohide: function _autohide (force) {
    let method = 'toggle';
    if (force) {
      method = 'remove';
    }
    var isHidden = this.classList[method]('autohide');
    let sidebar = this.querySelector('.hidden-block');
    sidebar.classList[method]('visible', isHidden);
  }
};

const createView = function _createView (model) {
  let options = {
    tagIs: 'project-viewer'
  };
  return constructor.createView(options, viewMethods, model);
};

module.exports = {
  createView: createView
};
