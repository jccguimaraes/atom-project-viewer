'use strict';

/* package */
const map = require('./map');
const domBuilder = require('./dom-builder');
const api = require('./api');

const viewsRef = {};
let startX;
let startWidth;
let dragListener;
let stopListener;

const invertResizer = function _invertResizer (inverted) {
  if (inverted) {
    viewsRef['resizer'].classList.add('invert');
  }
  else {
    viewsRef['resizer'].classList.remove('invert');
  }
};

const resizerResetDrag = function _resizerResetDrag () {
  this.removeAttribute('style');
  atom.config.set('project-viewer.customWidth', undefined);
};

const resizerInitializeDrag = function _resizerInitializeDrag (event) {
  this.classList.add('resizing');
  startX = event.clientX;
  startWidth = parseInt(window.getComputedStyle(this).width, 10);
  document.addEventListener('mousemove', dragListener, false);
  document.addEventListener('mouseup', stopListener, false);
};

const resizerDoDrag = function _resizerDoDrag (event) {
  let variation;
  if (atom.config.get('project-viewer.panelPosition') === 'Right') {
    variation = startX - event.clientX;
  }
  else {
    variation = event.clientX - startX;
  }
  this.setAttribute('style', `width:${startWidth + variation}px;`);
};

const resizerStopDrag = function _resizerStopDrag () {
  this.classList.remove('resizing');
  document.removeEventListener('mousemove', dragListener, false);
  document.removeEventListener('mouseup', stopListener, false);
  let value = parseInt(window.getComputedStyle(this).width, 10);
  if (value === 200) { value = undefined; }
  atom.config.set('project-viewer.customWidth', value);
};

const buildViews = function _buildViews (model) {
  let view;
  if (model.type === 'group') {
    view = api.group.createView(model);
  }
  else if (model.type === 'project') {
    view = api.project.createView(model);
  }
  view.initialize();
  view.render();
  viewsRef[model.uuid] = view;

  const parentModel = Object.getPrototypeOf(model);
  if (parentModel === Object.prototype) {
    this.attachChild(view);
  }
  else if (viewsRef.hasOwnProperty(parentModel.uuid)) {
    viewsRef[parentModel.uuid].attachChild(view);
  }
};

const toggleTitle = function _toggleTitle (visibility) {
  const title = this.querySelector('.heading');
  if (!title) { return; }
  title.classList.toggle('hidden', visibility);
};

const openEditor = function _openEditor (model) {
  const activePane = atom.workspace.getActivePane();
  const editorItem = api.editor.createView();
  map.set(editorItem, model);
  editorItem.initialize();
  activePane.addItem(editorItem);
  activePane.activateItem(editorItem);
};

const reset = function _reset () {
  const listTree = this.querySelector('ul.list-tree');
  if (listTree) {
    while (listTree.firstChild) {
      listTree.removeChild(listTree.firstChild);
    }
  }
};

const populate = function _populate (list) {
  if (!list || !Array.isArray(list)) {
    return;
  }
  this.reset();
  list.forEach(buildViews.bind(this));
};

const traverse = function _traverse (direction) {
  const selectionsUnfiltered = this.querySelectorAll(
    `li[is="project-viewer-group"],
    li[is="project-viewer-project"]`
  );

  let selectionsFiltered = Array.from(selectionsUnfiltered).filter(
    selection => {
      let isVisible = true;
      let parent = selection.parentNode;
      while(!parent.classList.contains('body-content')) {
        parent = parent.parentNode;
        if (!parent || parent.classList.contains('collapsed')) {
          selection.classList.remove('active');
          isVisible = false;
          break;
        }
      }
      return isVisible;
    }
  );

  let nextIdx = 0;

  selectionsFiltered.some(
    (selection, idx) => {
      if (selection.classList.contains('active')) {
        selection.classList.remove('active');
        nextIdx = direction === '☝️' ? idx - 1 : idx + 1;
        return true;
      }
    }
  );

  if (direction === '☝️' && nextIdx === -1) {
    nextIdx = selectionsFiltered.length - 1;
  }
  else if (
    (direction === '👇' && nextIdx === selectionsFiltered.length) ||
    direction === undefined
  ) {
    nextIdx = 0;
  }

  selectionsFiltered[nextIdx].classList.add('active');
};

const setAction = function _setAction (action) {
  const selectedView = this.querySelector(
    `li[is="project-viewer-group"].active,
    li[is="project-viewer-project"].active`
  );

  if (!selectedView) { return false; }

  const model = map.get(selectedView);

  if (!model) { return false; }

  if (model.type === 'group' && action === '📪') {
    selectedView.classList.add('collapsed');
  }
  else if (model.type === 'group' && action === '📭') {
    selectedView.classList.remove('collapsed');
  }
  else if (model.type === 'project' && action === '✅') {
    selectedView.openOnWorkspace();
  }
  else if (model.type === 'group' && action === '✅') {
    selectedView.classList.toggle('collapsed');
  }
};

const autohide = function _autohide (option) {
  if (option) {
    this.classList.add('autohide');
  }
  else if (option === false) {
    this.classList.remove('autohide');
  }
  else {
    this.classList.toggle('autohide');
  }
};

const toggleFocus = function _toggleFocus () {
  const panel = atom.workspace.panelForItem(this);
  if (!panel) { return false; }
  const item = panel.getItem();
  if (!item) { return false; }

  if (document.activeElement === item) {
    atom.workspace.getActivePane().activate();
    const selectedView = this.querySelector(
      `li[is="project-viewer-project"].active,
      li[is="project-viewer-project"].active`
    );
    if (selectedView) {
      selectedView.classList.remove('active');
    }
  } else {
    const activeView = this.querySelector(
      'li[is="project-viewer-project"].selected'
    );
    if (activeView) {
      activeView.classList.add('active');
    }
    item.focus();
  }
};

const viewUnfocus = function _viewUnfocus () {
  const selectedView = this.querySelector(
    `li[is="project-viewer-group"].active,
    li[is="project-viewer-project"].active`
  );
  if (!selectedView) { return; }

  selectedView.classList.remove('active');
}

const initialize = function _initialize () {

  this.addEventListener('blur', viewUnfocus.bind(this));

  this.setAttribute('tabindex', -1);
  this.classList.add('pv-has-icons');

  let hiddenBlock = document.createElement('div');
  hiddenBlock.classList.add('hidden-block');

  let pvResizer = document.createElement('div');
  pvResizer.classList.add('pv-resizer');
  viewsRef['resizer'] = pvResizer;

  if (atom.config.get('project-viewer.customWidth') !== 200) {
    this.setAttribute('style', `width:${atom.config.get('project-viewer.customWidth')}px;`);
  }

  let panelHeading = document.createElement('h2');
  panelHeading.classList.add('heading');
  panelHeading.textContent = 'Project-Viewer';

  let panelBody = document.createElement('div');
  panelBody.classList.add('body-content');

  let listTree = document.createElement('ul');
  listTree.classList.add(
    'list-tree',
    'has-collapsable-children',
    'pv-has-custom-icons'
  );

  this.addEventListener('dragstart', (evt) => {
    evt.stopPropagation();
  }, false);

  this.addEventListener('dragover', (evt) => {
    evt.preventDefault();
  }, false);

  this.addEventListener('dragleave', (evt) => {
    evt.stopPropagation();
  }, false);

  this.addEventListener('dragenter', (evt) => {
    evt.stopPropagation();
  }, false);

  this.addEventListener('dragend', (evt) => {
    evt.target.classList.remove('dragged');
    evt.stopPropagation();
  }, false);

  this.addEventListener('drop', (evt) => {
    const uuid = evt.dataTransfer.getData("text/plain");
    const view = document.querySelector(
      `project-viewer li[data-project-viewer-uuid="${uuid}"]`
    );

    if (!view) { return; }

    this.attachChild(view);
  }, false);

  panelBody.appendChild(listTree);
  hiddenBlock.appendChild(panelHeading);
  hiddenBlock.appendChild(panelBody);
  hiddenBlock.appendChild(pvResizer);
  this.appendChild(hiddenBlock);

  dragListener = resizerDoDrag.bind(this);
  stopListener = resizerStopDrag.bind(this);
  pvResizer.addEventListener('mousedown', resizerInitializeDrag.bind(this), false);
  pvResizer.addEventListener("dblclick", resizerResetDrag.bind(this), false);
};

const sorting = function _sorting () {
  const model = map.get(this);
  if (!model) { return; }

  return model.name;
};

const attachChild = function _attachChild (node) {
  let listTree = this.querySelector('.list-tree');
  if (!listTree) {
    return;
  }
  listTree.appendChild(node);
};

const detachChild = function _detachChild (node) {
  let listTree = this.querySelector('.list-tree');
  if (!listTree) {
    return;
  }
  listTree.removeChild(node);
};

const viewMethods = {
  attachChild,
  autohide,
  detachChild,
  initialize,
  openEditor,
  populate,
  reset,
  setAction,
  sorting,
  toggleFocus,
  toggleTitle,
  traverse,
  invertResizer
};

const createView = function _createView (model) {
  let options = {
    tagIs: 'project-viewer'
  };
  return domBuilder.createView(options, viewMethods, model);
};

module.exports = {
  createView: createView
};
