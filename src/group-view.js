'use strict';

const _caches = require('./caches');
const _constructor = require('./view-constructor');

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
    const model = _caches.get(this);

    if (!model) {
      return;
    }

    let listItem = document.createElement('div');
    listItem.classList.add('list-item');
    this.classList.add('list-nested-item');
    this.setAttribute('data-project-viewer-uuid', model.uuid);
    this.appendChild(listItem);

    atom.tooltips.add(
      listItem,
      {
        title: 'This is a tooltip',
        placement: 'left'
      }
    );
  },
  render: function _render () {
    const model = _caches.get(this);

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

    if (listTree) {
      let nodes = _helpers.castToArray(listTree.childNodes);
      let sorted = nodes;
      if (model.sortBy === 'alphabetically') {
        sorted = _helpers.sortArray(nodes)
      }
      sorted.forEach(
        (liView) => this.attachChild(liView)
      );
    }

    if (!listTree) {
      listTree = document.createElement('ul');
      listTree.classList.add('list-tree');
      this.appendChild(listTree);
    }
  },
  attachChild: function _attachChild (nodeOrModel) {
    let listTree = this.querySelector('.list-tree');
    if (!listTree) {
      this.render();
      listTree = this.querySelector('.list-tree');
    }
    let node = nodeOrModel;
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
    tagExtends: 'li',
    tagIs: 'project-viewer-list-nested-item'
  };
  return _constructor.createView(options, viewMethods, model);
};

module.exports = {
  createView: createView
};
