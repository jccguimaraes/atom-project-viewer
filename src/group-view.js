'use strict';

const caches = require('./common').caches;
const constructor = require('./common').constructor;
const utils = require('./common').utils;

const viewMethods = {
  // attachedCallback: function _attachedCallback () {},
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
    this.setAttribute('draggable', 'true');

    listItem.addEventListener('click', this.toggle.bind(this));

    this.addEventListener('dragstart', (evt) => {
      evt.dataTransfer.setData(
        "text/plain",
        utils.getModel(evt.target).uuid
      );
      evt.dataTransfer.dropEffect = "move";
      evt.target.classList.add('dragged');
      evt.stopPropagation();
    }, true);

    this.addEventListener('dragover', (evt) => {
      evt.preventDefault();
    }, true);

    this.addEventListener('dragleave', (evt) => {
      evt.stopPropagation();
    }, true);

    this.addEventListener('dragenter', (evt) => {
      evt.stopPropagation();
    }, true);

    this.addEventListener('dragend', (evt) => {
      evt.target.classList.remove('dragged');
      evt.stopPropagation();
    }, true);

    this.addEventListener('drop', (evt) => {
      evt.stopPropagation();
      const uuid = evt.dataTransfer.getData("text/plain");
      const view = document.querySelector(
        `project-viewer li[data-project-viewer-uuid="${uuid}"]`
      );

      if (!view) { return; }

      const droppedModel = utils.getModel(evt.target);
      const draggedModel = utils.getModel(view);

      const droppedView = utils.getView(droppedModel);

      if (droppedModel.type !== 'group') { return; }

      if (droppedView === view) { return; }

      droppedView.attachChild(view);
      const currentParentModel = Object.getPrototypeOf(draggedModel);
      Object.setPrototypeOf(draggedModel, droppedModel);

      utils.updateDB({
          currentModel: draggedModel,
          currentParentModel,
          currentChanges: null,
          newParentModel: droppedModel,
      });
    }, true);

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
