const map = require('./map');
const database = require('./database');
const domBuilder = require('./dom-builder');
const colours = require('./colours');
const {getModel, getView, sortList} = require('./common');

const dragstart = function _dragstart (evt) {
  evt.dataTransfer.setData(
    "text/plain",
    getModel(evt.target).uuid
  );
  // evt.dataTransfer.dropEffect = "move";
  const view = getView(evt.target);
  view.classList.add('dragged');
  evt.stopPropagation();
};

const dragover = function _dragover (evt) {
  const view = getView(evt.target);

  const threshold = view.querySelector('.list-item').clientHeight / 3;

  if (view.offsetTop + threshold > evt.layerY) {
    view.classList.add('above');
    view.classList.remove('center');
    view.classList.remove('below');
  }
  else if (view.offsetTop + (2 * threshold) > evt.layerY) {
    view.classList.remove('above');
    view.classList.add('center');
    view.classList.remove('below');
  }
  else {
    view.classList.remove('above');
    view.classList.remove('center');
    view.classList.add('below');
  }

  evt.preventDefault();
};

const dragleave = function _dragleave (evt) {
  const view = getView(evt.target);
  view.classList.remove('above', 'center', 'below');
  evt.stopPropagation();
};

const dragenter = function _dragenter (evt) {
  evt.stopPropagation();
};

const dragend = function _dragend (evt) {
  const view = getView(evt.target);
  view.classList.remove('above', 'center', 'below', 'dragged');
  evt.stopPropagation();
};

const drop = function _drop (evt) {
  evt.stopPropagation();
  const uuid = evt.dataTransfer.getData("text/plain");
  const draggedView = document.querySelector(
    `project-viewer li[data-project-viewer-uuid="${uuid}"]`
  );

  if (!draggedView) { return; }

  const droppedModel = getModel(evt.target);
  const draggedModel = getModel(draggedView);

  const droppedView = getView(evt.target);

  if (!droppedView) { return; }

  if (droppedModel.type !== 'group') { return; }

  if (droppedView === draggedView) { return; }

  // a bit hacky
  let insertBefore = undefined;

  if (droppedView.classList.contains('above')) {
    insertBefore = true;
  }
  else if (droppedView.classList.contains('below')) {
    insertBefore = false;
  }

  this.classList.remove('dropping', 'below', 'above', 'center');

  database.moveTo(draggedModel, droppedModel, insertBefore);
  database.save();
};

const viewMethods = {
  attachedCallback: function _attachedCallback () {
    this.addEventListener('dragstart', dragstart, false);
    this.addEventListener('dragover', dragover, false);
    this.addEventListener('dragleave', dragleave, false);
    this.addEventListener('dragenter', dragenter, false);
    this.addEventListener('dragend', dragend, false);
    this.addEventListener('drop', drop, false);
  },
  detachedCallback: function _detachedCallback () {
    let contentNode = this.querySelector('.list-item');
    if (contentNode) {
      contentNode.removeEventListener('click', this.expandOrCollapse.bind(this));
    }
    this.removeEventListener('dragstart', dragstart, false);
    this.removeEventListener('dragover', dragover, false);
    this.removeEventListener('dragleave', dragleave, false);
    this.removeEventListener('dragenter', dragenter, false);
    this.removeEventListener('dragend', dragend, false);
    this.removeEventListener('drop', drop, false);
  },
  expandOrCollapse: function _expandOrCollapse (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const model = map.get(getView(evt.target));
    if (!model) { return; }
    model.expanded = !model.expanded;
    this.classList.toggle('collapsed');
    database.save();
  },
  initialize: function _initialize () {

    const model = map.get(this);
    if (!model) { return; }

    let listItem = document.createElement('div');
    listItem.classList.add('list-item');
    listItem.addEventListener('click', this.expandOrCollapse.bind(this));

    this.classList.add('list-nested-item');
    this.classList.toggle('collapsed', !model.expanded);
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

    if (spanNode && spanNode.parentNode !== this) {
        spanNode = undefined;
    }

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
      if (model.icon.startsWith('devicons-')) {
        contentNode.classList.add('devicons', model.icon);
      }
      else {
        contentNode.classList.add('icon', model.icon);
      }
    }
    else if (spanNode) {
      contentNode.removeChild(spanNode);
    }

    if (model.name) {
      contentNode.textContent = model.name;
    }

    if (model.color) {
      colours.addRule(model.uuid, model.type, model.color);
    } else {
      colours.removeRule(model.uuid);
    }

    let listTree = this.querySelector('.list-tree');

    if (!listTree) {
      listTree = document.createElement('ul');
      listTree.classList.add('list-tree');
      this.appendChild(listTree);
    }
  },
  sortChildren: function _sortChildren () {
    const listTree = this.querySelector('.list-tree');
    if (!listTree) { return; }
    const children = Array.from(listTree.children);
    if (!children || children.length === 0) { return; }

    sortList(children, map.get(this).sortBy);
    children.forEach(view => listTree.appendChild(view));
  },
  attachChild: function _attachChild (node) {
    const listTree = this.querySelector('.list-tree');
    if (!listTree) { return; }
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
