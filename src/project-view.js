'use strict';

const map = require('./map');
const statusBar = require('./status-bar');
const domBuilder = require('./dom-builder');
const getSelectedProject = require('./common').getSelectedProject;
const getCurrentOpenedProject = require('./common').getCurrentOpenedProject;

const onClickEvent = function _onClickEvent (model) {
  if (!model) { return null; }
  this.openOnWorkspace();
};

const initialize = function _initialize () {
  const model = map.get(this);

  if (!model) { return; }

  this.classList.add('list-item');

  this.setAttribute('data-project-viewer-uuid', model.uuid);
  this.setAttribute('draggable', 'true');

  this.addEventListener(
    'click',
    onClickEvent.bind(this, model)
  );
};

const render = function _render () {
  const model = map.get(this);

  if (!model) {
    return;
  }

  let spanNode = this.querySelector('span');
  let contentNode = this;

  if (!spanNode) {
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
    contentNode = spanNode;
  }

  if (model.name) {
    contentNode.textContent = model.name;
  }

  this.classList.toggle('no-paths', model.paths.length === 0);

  const currentOpenedProject = getCurrentOpenedProject(model);

  this.classList.toggle(
    'selected',
    currentOpenedProject
  );

  if (currentOpenedProject) {
    statusBar.update(model.breadcrumb());
  }
};

const sorting = function _sorting () {
  const model = map.get(this);

  if (!model) {
    return;
  }
  return model.name;
};

const openOnWorkspace = function _openOnWorkspace () {
  const model = map.get(this);

  if (!model) { return false; }

  if (model.paths.length === 0) { return false; }

  const currentOpenedProject = getCurrentOpenedProject(model);

  if (currentOpenedProject) { return false; }

  let selectedProject = getSelectedProject();

  if (selectedProject) {
    selectedProject.classList.remove('selected');
  }

  this.classList.add('selected');

  if (atom.config.get('project-viewer.openNewWindow')) {
    atom.open({
      pathsToOpen: model.paths,
      newWindow: true,
      devMode: model.devMode,
      safeMode: false
    });
    return false;
  }

  let projectSHA = atom.getStateKey(atom.project.getPaths());
  let serialization = atom.serialize();

  if (projectSHA && serialization) {
    atom.getStorageFolder().storeSync(projectSHA, serialization);
  }

  statusBar.update(model.breadcrumb());

  projectSHA = atom.getStateKey(model.paths);
  serialization = atom.getStorageFolder().load(projectSHA);

  if (!serialization) {
    atom.workspace.destroyActivePane();
    atom.project.setPaths(model.paths);
    return true;
  }

  atom.deserialize(serialization);

  const linterPackage = atom.packages.getActivePackage('linter');

  // hack to make linter update on project switching
  if (linterPackage) {
    linterPackage.deactivate();
    linterPackage.activate();
  }

  return true;
};

const viewMethods = {
  initialize,
  render,
  sorting,
  openOnWorkspace
};

const createView = function _createView (model) {
  let options = {
    tagExtends: 'li',
    tagIs: 'project-viewer-project'
  };
  if (!model) {
    return;
  }
  return domBuilder.createView(options, viewMethods, model);
};

module.exports = {
  createView: createView
};
