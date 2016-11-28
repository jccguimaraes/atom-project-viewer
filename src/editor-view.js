'use strict';

const CompositeDisposable = require('atom').CompositeDisposable;
const map = require('./map');
const domBuilder = require('./dom-builder');
const buildBlock = require('./common').buildBlock;
const buildHeader = require('./common').buildHeader
const buildInput = require('./common').buildInput
const buildButton = require('./common').buildButton
const buildLabel = require('./common').buildLabel
const octicons = require('./json/octicons.json');
const devicons = require('./json/devicons.json');
const database = require('./database');
const viewsRef = {};

const getSelectedSortBy = function _getSelectedSortBy () {
  const view = viewsRef['pv-select-sortBy'];
  if (!view) { return; }
  const selected = view.selectedOptions[0];
  if (!selected) { return; }
  return selected.value;
};

const detachedCallback = function _detachedCallback () {
  this.disposables.dispose();
};

const attachedCallback = function _attachedCallback () {
  this.disposables = new CompositeDisposable();
  this.classList.add('native-key-bindings', 'pv-has-icons');
};

const getTitle = function _getTitle () {
  let model = map.get(this);
  console.log(model);
  return `PV Editor${model.name ? ' - ' + model.name : ''}`;
};

const actionsContainer = function _actionsContainer (parentView) {
  const actionsBlock = buildBlock();
  const cancelButton = buildButton('Cancel', 'warning');
  const deleteButton = buildButton('Delete', 'error');
  const successButton = buildButton('Create', 'success');

  actionsBlock.appendChild(cancelButton);
  actionsBlock.appendChild(deleteButton);
  actionsBlock.appendChild(successButton);
  parentView.appendChild(actionsBlock);
};

const nameContainer = function _setName (parentView) {
  const nameBlock = buildBlock();
  const nameHeader = buildHeader('Name');
  const nameInput = buildInput('text', 'name');

  if (this) {
    nameInput.value = this.name;
  }

  nameBlock.appendChild(nameHeader);
  nameBlock.appendChild(nameInput);
  parentView.appendChild(nameBlock);
};

const sortByContainer = function _sortByContainer (parentView) {
  const sortByBlock = buildBlock();
  const sortByHeader = buildHeader('Sort By');

  let sortBySelect = document.createElement('select');
  sortBySelect.classList.add('input-select', 'pv-select-sortBy');
  viewsRef['pv-select-sortBy'] = sortBySelect;

  const sortBy = [
    'alphabetically',
    'position',
    'reverse-alphabetically',
    'reverse-position'
  ];

  sortBy.forEach(
    (sortBy) => {
      const sortByOption = document.createElement('option');
      sortByOption.textContent = sortBy;
      sortBySelect.appendChild(sortByOption);
    }
  );

  sortByBlock.appendChild(sortByHeader);
  sortByBlock.appendChild(sortBySelect);

  parentView.appendChild(sortByBlock);
};

const iconContainer = function _iconContainer (parentView) {
  const iconBlock = buildBlock();
  const iconHeader = buildHeader('Icon');
  const iconInput = buildInput('search', 'icon');

  const iconList = document.createElement('div');
  iconList.classList.add('block', 'icons-list');

  octicons.list.concat(devicons.list).forEach(
    (icon) => {
      const iconView = document.createElement('span');
      iconView.textContent = icon;
      const iconType = icon.split('-')[0];
      iconView.classList.add('inline-block-tight', iconType, icon);
      iconView.addEventListener('click', () => {
        let view = iconList.querySelector('.highlight-success');
        if (view) {
          view.classList.remove('highlight-success');
        }
        iconView.classList.add('highlight-success');
      }, false);
      iconList.appendChild(iconView);
    }
  );

  iconBlock.appendChild(iconHeader);
  iconBlock.appendChild(iconInput);
  iconBlock.appendChild(iconList);

  parentView.appendChild(iconBlock);
};

const colorContainer = function _colorContainer (parentView) {
  const colorBlock = buildBlock();
  const colorHeader = buildHeader('Color');
  const colorInput = buildInput('color', 'color');

  colorBlock.appendChild(colorHeader);
  colorBlock.appendChild(colorInput);

  parentView.appendChild(colorBlock);
};

const optionsContainer = function _optionsContainer (parentView) {
  const optionsBlock = buildBlock();
  const optionsHeader = buildHeader('Options');
  const devModeInput = buildInput('checkbox', 'checkbox-devMode');
  const bulkInput = buildInput('checkbox', 'checkbox-bulk');
  const devModeLabel = buildLabel('Dev Mode', 'devMode', devModeInput);
  const bulkLabel = buildLabel('Bulk Paths', 'bulk', bulkInput);

  optionsBlock.appendChild(optionsHeader);
  optionsBlock.appendChild(devModeLabel);
  optionsBlock.appendChild(bulkLabel);
  parentView.appendChild(optionsBlock);
};

const pathsContainer = function _pathsContainer (parentView) {
  const pathsBlock = buildBlock();
  const pathsHeader = buildHeader('Paths');
  const pathsButton = buildButton('Add project folder(s)', 'primary');
  pathsButton.classList.add('pv-button-paths');

  let pathsList = document.createElement('ul');
  pathsList.classList.add('list-group');

  pathsBlock.appendChild(pathsHeader);
  pathsBlock.appendChild(pathsButton);
  pathsBlock.appendChild(pathsList);

  if (this) {
    this.paths.forEach(
      (path) => {
        let listItem = document.createElement('li');
        listItem.classList.add('list-item');
        let listItemSpanRemove = document.createElement('span');
        listItemSpanRemove.classList.add(
          'icon', 'icon-remove-close', 'pv-path-remove', 'text-error'
        );
        let listItemSpan = document.createElement('span');
        listItemSpan.classList.add('pv-path-name', 'text-info');
        listItemSpan.textContent = path;
        listItem.appendChild(listItemSpanRemove);
        listItem.appendChild(listItemSpan);
        pathsList.appendChild(listItem);
      }
    )
  }

  parentView.appendChild(pathsBlock);
};

const groupsContainer = function _parentContainer (parentView) {
  const groupsBlock = buildBlock();
  const groupsHeader = buildHeader('Groups');

  const listTree = document.createElement('ul');
  listTree.classList.add('list-tree');

  database.fetch().filter((entry) => {
    if (entry.type === 'group') {
      const nestedItem = document.createElement('li');
      nestedItem.classList.add('list-nested-item');
      const listItem = document.createElement('div');
      listItem.classList.add('list-item');
      listItem.setAttribute('data-pv-uuid', entry.uuid);
      listItem.textContent = entry.name;
      listItem.addEventListener('click', () => {
        let selected = listTree.querySelector('.selected');
        if (selected) {
          selected.classList.remove('selected');
        }
        if (selected !== nestedItem) {
          nestedItem.classList.add('selected');
        }
      }, false);
      nestedItem.appendChild(listItem);
      const parentModel = Object.getPrototypeOf(entry);
      if (parentModel === Object.prototype) {
        listTree.appendChild(nestedItem);
        return;
      }
      const parentView = listTree.querySelector(
        `[data-pv-uuid="${parentModel.uuid}"]`
      );
      if (!parentView) {
        return;
      }
      let subList = parentView.parentNode.querySelector('ul');
      if (!subList) {
        subList = document.createElement('ul');
        subList.classList.add('list-tree');
        parentView.parentNode.appendChild(subList);
      }
      subList.appendChild(nestedItem);
    }
  });

  groupsBlock.appendChild(groupsHeader);
  groupsBlock.appendChild(listTree);

  parentView.appendChild(groupsBlock);
};

const configContainer = function _configContainer () {};

const initialize = function _initialize () {
  const panelBody = document.createElement('div');
  let model = map.get(this);

  panelBody.classList.add('panel-body');
  this.appendChild(panelBody);

  actionsContainer.call(model, panelBody);
  nameContainer.call(model, panelBody);
  sortByContainer.call(model, panelBody);
  iconContainer.call(model, panelBody);
  colorContainer.call(model, panelBody);

  if (model.type === 'project') {
    optionsContainer.call(model, panelBody);
    pathsContainer.call(model, panelBody);
    configContainer.call(model, panelBody);
  }

  groupsContainer.call(model, panelBody);
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
