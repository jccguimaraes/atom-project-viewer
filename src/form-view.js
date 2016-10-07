'use strict';

/** atom */
const CompositeDisposable = require('atom').CompositeDisposable;

/* package */
const caches = require('./caches');
const _constructor = require('./constructor');
const constants = require('./constants.json');

const onCloseButton = function _onCloseButton () {
  atom.workspace.getActivePane().destroyActiveItem()
};

const onDeleteButton = function _onDeleteButton () {
  atom.workspace.getActivePane().destroyActiveItem()
};

const onSuccessButton = function _onSuccessButton () {
  let type = this.querySelector('.form-block-title input[checked]');
  let name = this.querySelector('.pv-input-name');
  let icon = this.querySelector('.icons-list .btn-success');
  let devMode = this.querySelector('.pv-checkbox-devmode');
  let bulk = this.querySelector('.pv-checkbox-bulk');
  let pathsList = this.querySelectorAll('.list-group li');
  let parentUuid = this.querySelector('.form-block-groups .selected');

  const model = caches.get(this);

  if (!model) { return false; }

  if (type) {
    type = type.nextSibling.textContent.toLowerCase();
  }

  if (name) {
    name = name.getModel().getBuffer().getText();
  }

  if (icon) {
    icon = icon.textContent;
  }

  if (devMode) {
    devMode = devMode.hasAttribute('checked');
  }

  if (bulk) {
    bulk = bulk.hasAttribute('checked');
  }

  if (pathsList) {
    pathsList = Array.from(pathsList).map(
      (pathView) => pathView.textContent
    );
  }

  if (parentUuid) {
    parentUuid = parentUuid
      .querySelector('.list-item')
      .getAttribute('data-pv-uuid')
  }

  model.submitter({
    updates: { type, name, icon, devMode, bulk, pathsList, parentUuid },
    model
  });
};

const createActions = function _createActions (parentView) {
  let actionsBlock = document.createElement('div');
  actionsBlock.classList.add('block', 'form-block-actions');
  let closeButton = document.createElement('button');
  closeButton.classList.add('inline-block', 'btn', 'btn-warning');
  closeButton.textContent = constants.form.actions.close.description;
  closeButton.addEventListener(
    'click',
    onCloseButton.bind(this),
    false
  );
  let deleteButton = document.createElement('button');
  deleteButton.classList.add('inline-block', 'btn', 'btn-error');
  deleteButton.textContent = constants.form.actions.delete.description;
  deleteButton.addEventListener(
    'click',
    onDeleteButton.bind(this),
    false
  );
  let successButton = document.createElement('button');
  successButton.classList.add(
    'pv-actions-success',
    'inline-block', 'btn', 'btn-success'
  );
  successButton.textContent = constants.form.actions.add.description;

  successButton.addEventListener(
    'click',
    onSuccessButton.bind(this),
    false
  );

  actionsBlock.appendChild(closeButton);
  actionsBlock.appendChild(deleteButton);
  actionsBlock.appendChild(successButton);

  parentView.appendChild(actionsBlock);
};

const createTitle = function _createTitle (parentView) {
  let titleBlock = document.createElement('div');
  titleBlock.classList.add('block', 'form-block-title');

  let titleOptionGroupLabel = document.createElement('label');
  titleOptionGroupLabel.classList.add('pv-form-radio-group', 'input-label');
  let titleOptionGroupInput = document.createElement('input');
  titleOptionGroupInput.classList.add('input-radio');
  titleOptionGroupInput.setAttribute('type', 'radio');
  titleOptionGroupInput.setAttribute('name', 'radio');
  titleOptionGroupInput.addEventListener('click', (evt) => {
    let checked = this.querySelector(
      '.form-block-title input[checked]'
    );
    if (checked) {
      checked.removeAttribute('checked')
    }
    evt.target.setAttribute('checked', '');
  }, false);
  titleOptionGroupLabel.textContent = 'Group';

  let titleOptionItemLabel = document.createElement('label');
  titleOptionItemLabel.classList.add('pv-form-radio-item', 'input-label');
  let titleOptionItemInput = document.createElement('input');
  titleOptionItemInput.classList.add('input-radio');
  titleOptionItemInput.setAttribute('type', 'radio');
  titleOptionItemInput.setAttribute('name', 'radio');
  titleOptionItemInput.setAttribute('checked', '');
  titleOptionItemInput.addEventListener('click', (evt) => {
    let checked = this.querySelector(
      '.form-block-title input[checked]'
    );
    if (checked) {
      checked.removeAttribute('checked')
    }
    evt.target.setAttribute('checked', '');
  }, false);
  titleOptionItemLabel.textContent = 'Item';

  // <input class='input-text' type='text' placeholder='Text'>
  let titleHeader = document.createElement('h1');
  titleHeader.textContent = constants.form.title.header.description;
  let nameInput = document.createElement('atom-text-editor');
  nameInput.setAttribute('mini', true);
  nameInput.classList.add('pv-input-name');
  nameInput.getModel()
    .placeholderText = constants.form.title.label.description;

  titleOptionGroupLabel.insertBefore(
    titleOptionGroupInput,
    titleOptionGroupLabel.firstChild
  );
  titleOptionItemLabel.insertBefore(
    titleOptionItemInput,
    titleOptionItemLabel.firstChild
  );
  titleBlock.appendChild(titleOptionGroupLabel);
  titleBlock.appendChild(titleOptionItemLabel);
  titleBlock.appendChild(titleHeader);
  titleBlock.appendChild(nameInput);

  parentView.appendChild(titleBlock);
};

const createIcons = function _createIcons (parentView) {
  let iconsBlock = document.createElement('div');
  iconsBlock.classList.add('block', 'form-block-icons');
  let iconsHeader = document.createElement('h1');
  iconsHeader.textContent = constants.form.icons.header.description;
  let iconsInput = document.createElement('atom-text-editor');
  iconsInput.setAttribute('mini', true);
  iconsInput.getModel()
    .placeholderText = constants.form.icons.label.description;
  let iconsList = document.createElement('div');
  iconsList.classList.add('block', 'icons-list');
  let octicons = require('./../node_modules/octicons/lib/keywords.json');
  let devicons = require('./../node_modules/devicon/devicon.json');

  const icons = Object.keys(octicons).map((icon) => {
    return {
      name: icon,
      prefix: 'octicon-',
      suffix: '',
      pack: 'octicon',
      description: `octicon-${icon}`
    };
  });

  icons.push(...devicons.map((icon) => {
    return {
      name: icon.name,
      prefix: 'devicon-',
      suffix: `-${icon.versions.font[0]}`,
      pack: 'icon',
      description: `devicon-${icon.name}`
    };
  }));

  icons.forEach((icon) => {
    let iconView = document.createElement('span');
    iconView.classList.add(
      'inline-block-tight', 'icon', icon.pack,
      `${icon.prefix}${icon.name}${icon.suffix}`
    );
    iconView.textContent = icon.description;
    iconView.addEventListener('click', () => {
      let view = iconsList.querySelector('.icon.btn-success');
      if (view) {
        view.classList.remove('btn-success');
      }
      iconView.classList.add('btn-success');
    }, false);
    iconsList.appendChild(iconView);
  });

  iconsBlock.appendChild(iconsHeader);
  iconsBlock.appendChild(iconsInput);
  iconsBlock.appendChild(iconsList);

  parentView.appendChild(iconsBlock);
};

const createGeneralSettings = function _createGeneralSettings (parentView) {
  let settingsBlock = document.createElement('div');
  settingsBlock.classList.add('block', 'form-block-settings');
  let settingsHeader = document.createElement('h1');
  settingsHeader.textContent = constants.form.settings.header.description;
  let settingsCheckList = document.createElement('div');
  settingsCheckList.classList.add('block');
  let devModeLabel = document.createElement('label');
  devModeLabel.classList.add('input-label');
  devModeLabel.innerHTML = constants.form.settings.devMode.description;

  let devModeCheckBox = document.createElement('input');
  devModeCheckBox.classList.add('pv-checkbox-devmode', 'input-checkbox');
  devModeCheckBox.setAttribute('type', 'checkbox');
  devModeCheckBox.addEventListener('click', (evt) => {
    if (!evt.target.hasAttribute('checked')) {
      evt.target.setAttribute('checked', '');
    }
    else {
      evt.target.removeAttribute('checked');
    }
  }, false);

  let devModeInfo = document.createElement('span');
  devModeInfo.classList.add(
    'icon', 'octicon', 'octicon-question', 'inline-block', 'text-info'
  );
  this.disposables.add(atom.tooltips.add(
    devModeInfo,
    {
      title: constants.form.settings.devMode.details,
      delay: {
        show: 100,
        hide: 100
      }
    }
  ));
  let bulkLabel = document.createElement('label');
  bulkLabel.classList.add('input-label');
  bulkLabel.innerHTML = constants.form.settings.bulk.description;
  let bulkCheckBox = document.createElement('input');
  bulkCheckBox.classList.add('pv-checkbox-bulk', 'input-checkbox');
  bulkCheckBox.setAttribute('type', 'checkbox');
  bulkCheckBox.addEventListener('click', (evt) => {
    if (!evt.target.hasAttribute('checked')) {
      evt.target.setAttribute('checked', '');
    }
    else {
      evt.target.removeAttribute('checked');
    }
  }, false);

  let bulkInfo = document.createElement('span');
  bulkInfo.classList.add(
    'icon', 'octicon', 'octicon-question', 'inline-block', 'text-info'
  );
  this.disposables.add(atom.tooltips.add(
    bulkInfo,
    {
      title: constants.form.settings.bulk.details,
      delay: { show: 100, hide: 100 }
    }
  ));

  devModeLabel.insertBefore(
    devModeCheckBox,
    devModeLabel.firstChild
  );
  bulkLabel.insertBefore(
    bulkCheckBox,
    bulkLabel.firstChild
  );
  devModeLabel.appendChild(devModeInfo);
  bulkLabel.appendChild(bulkInfo);
  settingsCheckList.appendChild(devModeLabel);
  settingsCheckList.appendChild(bulkLabel);
  settingsBlock.appendChild(settingsHeader);
  settingsBlock.appendChild(settingsCheckList);

  parentView.appendChild(settingsBlock);
};

const buildGroup = function _buildGroup (parent, currentModel, group) {
  if (!group) { return false; }
  let nestedItem;
  if (
    group.hasOwnProperty('model') &&
    (!currentModel || group.model.uuid !== currentModel.uuid)
  ) {
    nestedItem = document.createElement('li');
    nestedItem.classList.add('list-nested-item');
    let listItem = document.createElement('div');
    listItem.classList.add('list-item');
    listItem.setAttribute('data-pv-uuid', group.model.uuid);
    listItem.textContent = group.model.name;
    listItem.addEventListener('click', () => {
      let selected = this.querySelector('.form-block-groups .selected');
      if (selected) {
        selected.classList.remove('selected');
      }
      if (selected !== nestedItem) {
        nestedItem.classList.add('selected');
      }
    }, false);
    let groupParent;
    if (currentModel) {
      groupParent = Object.getPrototypeOf(currentModel);
    }
    if (groupParent && groupParent.uuid === group.model.uuid) {
      nestedItem.classList.add('selected');
    }
    nestedItem.appendChild(listItem);
    parent.appendChild(nestedItem);
  }

  if (group.hasOwnProperty('list') && nestedItem !== undefined) {
    const listTree = document.createElement('ul');
    listTree.classList.add('list-tree');
    nestedItem.appendChild(listTree);
    group.list.forEach(buildGroup.bind(this, listTree, currentModel));
  }
};

const createGroups = function _createGroups (parentView) {
  const model = caches.get(this);
  if (!model) { return false; }

  const groupsList = model.getGroups();

  let groupsBlock = document.createElement('div');
  groupsBlock.classList.add('block', 'form-block-groups');
  let groupsHeader = document.createElement('h1');
  groupsHeader.textContent = constants.form.groups.header.description;

  const listTree = document.createElement('ul');
  listTree.classList.add('list-tree');

  groupsList.forEach(buildGroup.bind(this, listTree, model.current));

  groupsBlock.appendChild(groupsHeader);
  groupsBlock.appendChild(listTree);

  parentView.appendChild(groupsBlock);
};

const createPath = function _createPath (pathsView, path) {
  let listItem = document.createElement('li');
  listItem.classList.add('list-item', 'text-info');
  let listItemSpanRemove = document.createElement('span');
  listItemSpanRemove.classList.add('icon', 'icon-remove-close', 'pv-path-remove');
  // let listItemSpanRedo = document.createElement('span');
  // listItemSpanRedo.classList.add('icon', 'icon-mail-reply', 'pv-path-redo');
  let listItemSpan = document.createElement('span');
  listItemSpan.classList.add('pv-path-name');
  listItemSpan.textContent = path;
  listItem.appendChild(listItemSpanRemove);
  // listItem.appendChild(listItemSpanRedo);
  listItem.appendChild(listItemSpan);
  pathsView.appendChild(listItem);
};

const updatePaths = function _updatePaths (paths) {
  const pathsView = this.querySelector('.form-block-paths .list-group');

  if (!pathsView) { return null; }

  paths.forEach(createPath.bind(this, pathsView));
};

const createPaths = function _createPaths (parentView) {
  let pathsBlock = document.createElement('div');
  pathsBlock.classList.add('block', 'form-block-paths');
  let pathsHeader = document.createElement('h1');
  pathsHeader.textContent = constants.form.paths.header.description;
  let pathsAddButton = document.createElement('button');
  pathsAddButton.classList.add(
    'btn', 'btn-primary', 'icon', 'icon-file-directory'
  );
  pathsAddButton.textContent = constants.form.paths.add.description;
  pathsAddButton.addEventListener('click', () => {
    atom.pickFolder(updatePaths.bind(this));
  }, false);
  let pathsList = document.createElement('ul');
  pathsList.classList.add('list-group');

  pathsBlock.appendChild(pathsHeader);
  pathsBlock.appendChild(pathsAddButton);
  pathsBlock.appendChild(pathsList);
  parentView.appendChild(pathsBlock);
};

const viewMethods = {
  detachedCallback: function _detachedCallback () {
    this.disposables.dispose();
  },
  attachedCallback: function _attachedCallback () {
    this.disposables = new CompositeDisposable();

    this.classList.add('pv-has-custom-icons');

    let panelBody = document.createElement('div');
    panelBody.classList.add('panel-body');

    // ACTIONS
    createActions.call(this, panelBody);
    // NAME
    createTitle.call(this, panelBody);
    // ICONS
    createIcons.call(this, panelBody);
    // GENERAL SETTINGS
    createGeneralSettings.call(this, panelBody);
    // PATHS
    createPaths.call(this, panelBody);
    // GROUPS
    createGroups.call(this, panelBody);

    this.appendChild(panelBody);
  },
  getTitle: function _getTitle () {
    return 'Project Viewer Creator';
  },
  render: function _render () {
    let model = caches.get(this);

    if (!model || !model.current) { return; }

    if (model.current.hasOwnProperty('uuid')) {
      const successButton = this.querySelector('.pv-actions-success');
      successButton.textContent = constants.form.actions.update.description;
    }

    if (model.current.hasOwnProperty('type')) {
      const radioButton = this.querySelector(
        `.pv-form-radio-${model.current.type} input`
      );
      const checked = this.querySelector(
        '.form-block-title input[checked]'
      );
      if (checked !== radioButton) {
        checked.removeAttribute('checked')
      }
      radioButton.setAttribute('checked', '');
    }

    if (model.current.hasOwnProperty('name')) {
      const nameInput = this.querySelector('.pv-input-name');
      nameInput.getModel().getBuffer().setText(model.current.name);
    }

    if (model.current.hasOwnProperty('icon') && model.current.icon.length > 0) {
      let iconList = this.querySelector('.icons-list');
      let icon = this.querySelector(`.${model.current.icon}`);
      if (!icon) {
        return;
      }
      icon.classList.add('btn-success');
      iconList.scrollTop = icon.offsetTop;
    }

    // if (model.current.hasOwnProperty('color')) {}

    if (model.current.hasOwnProperty('devMode')) {
      const devModeheckBox = this.querySelector('.pv-checkbox-devmode');
      devModeheckBox.checked = model.current.devMode;
    }

    if (
      model.current.hasOwnProperty('paths') &&
      Array.isArray(model.current.paths)
    ) {
      updatePaths.call(this, model.current.paths);
    }
  }
};

const createView = function _createView (model) {
  let options = {
    tagIs: 'project-viewer-form'
  };
  return _constructor.createView(options, viewMethods, model);
};

module.exports = {
  createView: createView
};
