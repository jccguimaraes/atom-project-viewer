'use strict';

const map = require('./map');
const domBuilder = require('./dom-builder');
const getModel = require('./common').getModel;

const onClickEvent = function _onClickEvent (model) {
  if (!model) { return null; }
  this.openOnWorkspace();
};

const viewMethods = {
  initialize: function _initialize () {
    const model = map.get(this);

    if (!model) { return; }

    this.classList.add('list-item');

    // TODO do we need this?
    this.setAttribute('data-project-viewer-uuid', model.uuid);
    this.setAttribute('draggable', 'true');

    this.addEventListener(
      'click',
      onClickEvent.bind(this, model)
    );

    this.addEventListener('dragstart', (evt) => {
      evt.dataTransfer.setData(
        "text/plain",
        getModel(evt.target).uuid
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

      //   const deadzone = getModel(evt.target);
      //   const landingView = getView(deadzone);

      // if (deadzone.type !== 'group') { return; }
      //
      // if (landingView === view) { return; }
      //
      // try {
      //     landingView.attachChild(view);
      // }
      // catch (e) {
      //     atom.notifications.addError('drag&drop error', {
      //         description: 'trying to add a parent to a child!'
      //     });
      // }
    }, true);
  },
  render: function _render () {
    const model = map.get(this);

    if (!model) {
      return;
    }

    let spanNode = this.querySelector('span');
    let contentNode = this;

    if (/*model.icon && */!spanNode) {
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
      // contentNode.removeChild(spanNode);
    }

    if (model.name) {
      contentNode.textContent = model.name;
    }

    this.classList.toggle('no-paths', model.paths.length === 0);

    let currentOpenedProject = atom.project.getPaths().length > 0 &&
    model.paths.length > 0 &&
    !atom.project.getPaths().some(
      path => {
        return model.paths.indexOf(path) === -1;
      }
    );
    this.classList.toggle(
      'selected',
      currentOpenedProject
    );
  },
  sorting: function _sorting () {
    const model = map.get(this);

    if (!model) {
      return;
    }
    return model.name;
  },
  openOnWorkspace: function _openOnWorkspace () {
    const model = map.get(this);

    if (!model) { return false; }

    if (model.paths.length === 0) { return false; }

    let currentOpenedProject = atom.project.getPaths().length > 0 &&
    model.paths.length > 0 &&
    !atom.project.getPaths().some(
      path => {
        return model.paths.indexOf(path) === -1;
      }
    );

    if (currentOpenedProject) { return false; }

    let selected = document.querySelector(
      'project-viewer .has-collapsable-children .selected'
    );
    if (selected && selected !== this) {
      selected.classList.remove('selected');
    }
    if (selected !== this) {
      this.classList.add('selected');
    }

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
    let serialization;
    let tV = atom.packages.getActivePackage('tree-view');

    if (!atom.config.get('project-viewer.keepContext') && projectSHA) {
      serialization = {
        workspace: atom.workspace.serialize(),
        project: atom.project.serialize()
      }

      if (
        atom.project.getPaths().length > 0 &&
        tV &&
        tV.mainModule &&
        tV.mainModule.treeView
      ) {
        serialization.treeView = tV.mainModule.treeView.serialize();
        serialization.treeView.scrollTop = tV.mainModule.treeView.scrollTop();
      }
    }

    if (serialization) {
      atom.getStorageFolder().storeSync(projectSHA, serialization);
    }

    projectSHA = atom.getStateKey(model.paths);
    serialization = atom.getStorageFolder().load(projectSHA);

    if (atom.config.get('project-viewer.keepContext')) {
      atom.project.setPaths(model.paths);
      return true;
    }

    if (!serialization) {
      atom.workspace.destroyActivePane();
      atom.project.setPaths(model.paths);
      return true;
    }

    atom.project.deserialize(serialization.project, atom.deserializers);
    // updateStatusBar(model.breadcrumb());

    if (serialization.treeView && tV.mainModule.treeView) {
      tV.mainModule.treeView.updateRoots(serialization.treeView.directoryExpansionStates);
      if (serialization.treeView.scrollTop > 0) tV.mainModule.treeView.scrollTop(serialization.treeView.scrollTop);
      if (serialization.treeView.width > 0) tV.mainModule.treeView.width(serialization.treeView.width);
    }

    if (serialization.treeView && !tV.mainModule.treeView) {
      tV.mainModule.createView(serialization.treeView);
    }

    if (atom.config.get('project-viewer.keepContext')) { return true; }

    atom.workspace.deserialize(serialization.workspace, atom.deserializers);

    return true;
  }
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
