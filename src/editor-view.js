'use strict';

/** atom */
const CompositeDisposable = require('atom').CompositeDisposable;

const map = require('./map');
const domBuilder = require('./dom-builder');

const detachedCallback = function _detachedCallback () {
  this.disposables.dispose();
};

const attachedCallback = function _attachedCallback () {
  this.disposables = new CompositeDisposable();
  this.classList.add('native-key-bindings');
};

const getTitle = function _getTitle () {
  return 'PV Editor';
};

const nameContainer = function _setName (parentView) {
  let nameBlock = document.createElement('div');
  nameBlock.classList.add('block', 'pv-editor-block-name');

  let nameHeader = document.createElement('h2');
  nameHeader.textContent = 'Name';
  nameHeader.classList.add('pv-editor-header');

  let nameInput = document.createElement('input');
  nameInput.setAttribute('type', 'text');
  nameInput.classList.add('input-text', 'pv-input-name');

  if (this) {
    nameInput.value = this.name;
  }

  nameBlock.appendChild(nameHeader);
  nameBlock.appendChild(nameInput);

  parentView.appendChild(nameBlock);
};

const initialize = function _initialize () {
    let model = map.get(this);

    if (!model) {
      model = {
          name: 'atom-project-viewer'
      }
    }

    const panelBody = document.createElement('div');
    panelBody.classList.add('panel-body');

    this.appendChild(panelBody);

    nameContainer.call(model, panelBody);
};

const viewMethods = {
  detachedCallback,
  attachedCallback,
  getTitle,
  initialize
};

const createView = function _createView (model) {
  let options = {
    tagIs: 'project-viewer-editor'
  };
  return domBuilder.createView(options, viewMethods, model);
};

module.exports = {
  createView: createView
};
