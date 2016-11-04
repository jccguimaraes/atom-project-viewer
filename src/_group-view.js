'use strict';

const map = require('./_map');
const domBuilder = require('./_dom-builder');
const getModel = require('./_common').getModel;
const getView = require('./_common').getView;

const dragstart = function _dragstart (evt) {
  evt.dataTransfer.setData(
    "text/plain",
    getModel(evt.target).uuid
  );
  evt.dataTransfer.dropEffect = "move";
  evt.target.classList.add('dragged');
  evt.stopPropagation();
};

const dragover = function _dragover (evt) {
  evt.preventDefault();
};

const dragleave = function _dragleave (evt) {
  evt.stopPropagation();
};

const dragenter = function _dragenter (evt) {
  evt.stopPropagation();
};

const dragend = function _dragend (evt) {
  evt.target.classList.remove('dragged');
  evt.stopPropagation();
};

const drop = function _drop (evt) {
    evt.stopPropagation();
    const uuid = evt.dataTransfer.getData("text/plain");
    const view = document.querySelector(
      `project-viewer li[data-project-viewer-uuid="${uuid}"]`
    );

    if (!view) { return; }

    const droppedModel = getModel(evt.target);
    const draggedModel = getModel(view);

    const droppedView = getView(evt.target);

    if (!droppedView) { return; }

    if (droppedModel.type !== 'group') { return; }

    if (droppedView === view) { return; }

    droppedView.attachChild(view);
    Object.setPrototypeOf(draggedModel, droppedModel);
};

const viewMethods = {
  attachedCallback: function _attachedCallback () {
    this.addEventListener('dragstart', dragstart, true);
    this.addEventListener('dragover', dragover, true);
    this.addEventListener('dragleave', dragleave, true);
    this.addEventListener('dragenter', dragenter, true);
    this.addEventListener('dragend', dragend, true);
    this.addEventListener('drop', drop, true);
  },
  detachedCallback: function _detachedCallback () {
    let contentNode = this.querySelector('.list-item');
    if (contentNode) {
      contentNode.removeEventListener('click', this.toggle.bind(this));
    }
    this.removeEventListener('dragstart', dragstart, true);
    this.removeEventListener('dragover', dragover, true);
    this.removeEventListener('dragleave', dragleave, true);
    this.removeEventListener('dragenter', dragenter, true);
    this.removeEventListener('dragend', dragend, true);
    this.removeEventListener('drop', drop, true);
  },
  toggle: function _toggle (evt) {
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    this.classList.toggle('collapsed');
  },
  initialize: function _initialize () {

    const model = map.get(this);
    if (!model) { return; }

    let listItem = document.createElement('div');
    listItem.classList.add('list-item');
    listItem.addEventListener('click', this.toggle.bind(this));

    this.classList.add('list-nested-item');
    this.setAttribute('data-project-viewer-uuid', model.uuid);
    this.setAttribute('draggable', 'true');
    this.appendChild(listItem);

    return true;
  },
  render: function _render () {
    const model = map.get(this);

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

    let thisModel = map.get(this);
    let nodeModel = map.get(node);

    if (nodeModel === Object.getPrototypeOf(thisModel)) {
      return;
    }

    if (!nodeModel || !thisModel) {
      return;
    }
    listTree.appendChild(node);
    Object.setPrototypeOf(nodeModel, thisModel);
  },
  detachChild: function _detachChild (node) {
    let listTree = this.querySelector('.list-tree');
    if (!listTree) {
      return;
    }
    listTree.removeChild(node);
  },
  sorting: function _sorting () {
    const model = map.get(this);

    if (!model) { return; }

    return model.name;
  }
};

const createView = function _createView (model) {
  let options = {
    tagExtends: 'li',
    tagIs: 'project-viewer-group'
  };
  if (!model) {
    return;
  }
  return domBuilder.createView(options, viewMethods, model);
};

module.exports = {
  createView: createView
};
