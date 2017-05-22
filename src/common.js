const map = require('./map');
const config = require('./config');

const cleanConfig = function _cleanConfig () {
  const values = Object.keys(atom.config.getAll('project-viewer')[0].value);

  values.forEach(
    value => {
        if (value === 'disclaimer') {
          const versions = atom.config.get('project-viewer.disclaimer');
          for (let v in versions) {
            if (v !== Object.keys(config.disclaimer.properties)[0]) {
              atom.config.unset(`project-viewer.disclaimer.${v}`);
            }
          }
        }
      if (config.hasOwnProperty(value)) {
        return;
      }
      atom.config.unset(`project-viewer.${value}`);
    }
  );
};

const getModel = function _getModel (view) {
  if (!view) { return undefined; }
  return map.get(getView(view));
};

const getView = function _getView (view) {
  if (!view) { return undefined; }
  while (view && view.nodeName !== 'LI') {
    view = view.parentNode;
  }
  return view;
};

const getViewFromModel = function _getViewFromModel (model) {
  return document.querySelector(
    `project-viewer li[data-project-viewer-uuid="${model.uuid}"]`
  );
};

const getSelectedProject = function _getSelectedProject () {
  return document.querySelector(
    'project-viewer li[is="project-viewer-project"].selected'
  );
};

const getCurrentOpenedProject = function _getCurrentOpenedProject (model) {
  return model && Array.isArray(model.paths) &&
  atom.project.getPaths().length > 0 && model.paths.length > 0 &&
  model.paths.length === atom.project.getPaths().length &&
  atom.project.getPaths().every(path => model.paths.indexOf(path) !== -1);
};

const buildBlock = function _buildBlock () {
  const view = document.createElement('div');
  view.classList.add('block', 'pv-editor-block');
  return view;
};

const buildHeader = function _buildHeader (text) {
  const view = document.createElement('h2');
  view.textContent = text;
  view.classList.add('pv-editor-header');
  return view;
};

const buildInput = function _buildInput (type, block) {
  const view = document.createElement('input');
  view.setAttribute('type', type);
  view.classList.add(`input-${type}`, `pv-input-${block}`);
  return view;
};

const buildButton = function _buildButton (text, action) {
  const view = document.createElement('button');
  view.textContent = text;
  view.classList.add('inline-block', 'btn', `btn-${action}`);
  return view;
};

const buildLabel = function _buildLabel (text, type, child) {
  const view = document.createElement('label');
  view.classList.add('input-label', `pv-input-label-${type}`);
  const textNode = document.createTextNode(text);
  if (child) { view.appendChild(child); }
  view.appendChild(textNode);
  return view;
};

const sorter = function _sorter (reversed, previousView, currentView) {
  return (reversed ? -1 : 1) * new Intl.Collator().compare(
    getModel(previousView).name,
    getModel(currentView).name
  );
};

const sortList = function _sortList (list, sortBy) {
  const reversed = sortBy.includes('reverse');
  const byPosition = sortBy.includes('position');
  if (!byPosition) {
    list = list.sort(sorter.bind(null, reversed))
    return;
  }
  if (reversed) {
    list.reverse();
  }
};

exports.cleanConfig = cleanConfig;
exports.getModel = getModel;
exports.getViewFromModel = getViewFromModel;
exports.getSelectedProject = getSelectedProject;
exports.getCurrentOpenedProject = getCurrentOpenedProject;
exports.getView = getView;
exports.buildBlock = buildBlock;
exports.buildHeader = buildHeader;
exports.buildInput = buildInput;
exports.buildButton = buildButton;
exports.buildLabel = buildLabel;
exports.sortList = sortList;
