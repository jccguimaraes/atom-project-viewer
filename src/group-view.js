'use strict';

const caches = require('./caches');
const constructor = require('./constructor');

const viewMethods = {
  attachedCallback: function _attachedCallback () {
    let contentNode = this.querySelector('.list-item');
    contentNode.addEventListener('click', this.toggle.bind(this));
  },
  detachedCallback: function _detachedCallback () {
    let contentNode = this.querySelector('.list-item');
    contentNode.removeEventListener('click', this.toggle.bind(this));
  },
  toggle: function _toggle (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.classList.toggle('collapsed');
  },
  initialize: function _initialize () {
    const model = caches.get(this);

    if (!model) {
      return;
    }

    let listItem = document.createElement('div');
    listItem.classList.add('list-item');
    this.classList.add('list-nested-item');
    this.setAttribute('data-project-viewer-uuid', model.uuid);
    this.appendChild(listItem);
  },
  render: function _render () {
    const model = caches.get(this);

    if (!model) {
      return;
    }

    let spanNode = this.querySelector('.list-item span');
    let contentNode = this.querySelector('.list-item');

    if (!contentNode) {
      return;
    }

    if (model.icon && !spanNode) {
      contentNode.textContent = '';
      spanNode = document.createElement('span');
      contentNode.appendChild(spanNode);
    }

    if (model.icon) {
      contentNode = spanNode;
      contentNode.classList.add('icon', model.icon);
    }
    else if (spanNode) {
      contentNode.removeChild(spanNode);
    }

    if (model.name) {
      contentNode.textContent = model.name;
    }

    let listTree = this.querySelector('.list-tree');

    if (!listTree) {
      listTree = document.createElement('ul');
      listTree.classList.add('list-tree');
      this.appendChild(listTree);
    }
  },
  attachChild: function _attachChild (node) {
    let listTree = this.querySelector('.list-tree');
    if (!listTree) {
      return;
    }
    listTree.appendChild(node);

    let thisModel = caches.get(this);
    let nodeModel = caches.get(node);

    if (!nodeModel || !thisModel) {
      return;
    }
    Object.setPrototypeOf(nodeModel, thisModel);
    thisModel.addMetrics(nodeModel);
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

    if (!model) { return; }

    return model.name;
  }
};

const createView = function _createView (model) {
  let options = {
    tagExtends: 'li',
    tagIs: 'project-viewer-list-nested-item'
  };
  return constructor.createView(options, viewMethods, model);
};

module.exports = {
  createView: createView
};
