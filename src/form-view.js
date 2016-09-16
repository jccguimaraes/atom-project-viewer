'use strict';

/** atom */
const CompositeDisposable = require('atom').CompositeDisposable;

/* package */
const caches = require('./caches');
const _constructor = require('./constructor');
const constants = require('./constants.json');

const onSuccessButton = function _onSuccessButton () {
  let type = this.querySelectorAll('.form-block-title input');
  let name = this.querySelector('.pv-input-name');
  let icon = this.querySelector('.icons-list .btn-success');
  let devMode = this.querySelector('.pv-checkbox-devmode');
  let bulk = this.querySelector('.pv-checkbox-bulk');
  let paths = this.querySelectorAll('.list-group li');

  const model = caches.get(this);

  model.setters({
    type,
    name,
    icon,
    devMode,
    bulk,
    paths
  });
};

const groups = function _groups (viewParent) {
  const groupsView = document.createElement('div');
  viewParent.appendChild(groupsView);

  const model = caches.get(this);

  model.getGroups();
};

const viewMethods = {
  detachedCallback: function _detachedCallback () {
    this.disposables.dispose();
  },
  attachedCallback: function _attachedCallback () {
    this.disposables = new CompositeDisposable();

    let panelBody = document.createElement('div');
    panelBody.classList.add('panel-body');

    // ACTIONS
    let actionsBlock = document.createElement('div');
    actionsBlock.classList.add('block', 'form-block-actions');
    let closeButton = document.createElement('button');
    closeButton.classList.add('inline-block', 'btn', 'btn-warning');
    closeButton.textContent = constants.form.actions.close.description;
    closeButton.addEventListener(
      'click',
      () => atom.workspace.getActivePane().destroyActiveItem(),
      false
    );
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('inline-block', 'btn', 'btn-error');
    deleteButton.textContent = constants.form.actions.delete.description;
    deleteButton.addEventListener(
      'click',
      () => atom.workspace.getActivePane().destroyActiveItem(),
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
      () => onSuccessButton.bind(this),
      false
    );

    // NAME
    let titleBlock = document.createElement('div');
    titleBlock.classList.add('block', 'form-block-title');

    let titleOptionGroupLabel = document.createElement('label');
    titleOptionGroupLabel.classList.add('pv-form-radio-group', 'input-label');
    let titleOptionGroupInput = document.createElement('input');
    titleOptionGroupInput.classList.add('input-radio');
    titleOptionGroupInput.setAttribute('type', 'radio');
    titleOptionGroupInput.setAttribute('name', 'radio');
    titleOptionGroupLabel.textContent = 'Group';

    let titleOptionItemLabel = document.createElement('label');
    titleOptionItemLabel.classList.add('pv-form-radio-item', 'input-label');
    let titleOptionItemInput = document.createElement('input');
    titleOptionItemInput.classList.add('input-radio');
    titleOptionItemInput.setAttribute('type', 'radio');
    titleOptionItemInput.setAttribute('name', 'radio');
    titleOptionItemLabel.textContent = 'Item';

    let titleHeader = document.createElement('h1');
    titleHeader.textContent = constants.form.title.header.description;
    let titleLabel = document.createElement('label');
    titleLabel.textContent = constants.form.title.label.description;
    titleLabel.classList.add('text-subtle');
    let nameInput = document.createElement('atom-text-editor');
    nameInput.setAttribute('mini', true);
    nameInput.classList.add('pv-input-name');
    nameInput.getModel()
      .placeholderText = constants.form.title.label.description;

    // ICONS
    let iconsBlock = document.createElement('div');
    iconsBlock.classList.add('block', 'form-block-icons');
    let iconsHeader = document.createElement('h1');
    iconsHeader.textContent = constants.form.icons.header.description;
    let iconsLabel = document.createElement('label');
    iconsLabel.textContent = constants.form.icons.label.description;
    iconsLabel.classList.add('text-subtle');
    let iconsInput = document.createElement('atom-text-editor');
    iconsInput.setAttribute('mini', true);
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
        let view = this.parentNode.querySelector('.icon.btn-success');
        if (view) {
          view.classList.remove('btn-success');
        }
        this.classList.add('btn-success');
      }, false);
      iconsList.appendChild(iconView);
    });

    // GENERAL SETTINGS
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
    let devModeInfo = document.createElement('span');
    devModeInfo.classList.add(
      'icon', 'octicon', 'octicon-question', 'inline-block', 'text-info'
    );
    atom.tooltips.add(
      devModeInfo,
      {
        title: constants.form.settings.devMode.details,
        delay: {
          show: 100,
          hide: 100
        }
      }
    )
    let bulkLabel = document.createElement('label');
    bulkLabel.classList.add('input-label');
    bulkLabel.innerHTML = constants.form.settings.bulk.description;
    let bulkCheckBox = document.createElement('input');
    bulkCheckBox.classList.add('pv-checkbox-bulk', 'input-checkbox');
    bulkCheckBox.setAttribute('type', 'checkbox');
    let bulkInfo = document.createElement('span');
    bulkInfo.classList.add(
      'icon', 'octicon', 'octicon-question', 'inline-block', 'text-info'
    );
    atom.tooltips.add(
      bulkInfo,
      {
        title: constants.form.settings.bulk.details,
        delay: { show: 100, hide: 100 }
      }
    )

    // PATHS
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
      atom.pickFolder((folders) => {
        const pathsList = this.querySelector('.list-group');
        if (!Array.isArray(folders)) {
          return;
        }
        folders.forEach(
          (folder) => {
            let listItem = document.createElement('li');
            listItem.classList.add('list-item', 'text-info');
            listItem.textContent = folder;
            pathsList.appendChild(listItem);
          }
        );
      });
    }, false);
    let pathsList = document.createElement('ul');
    pathsList.classList.add('list-group');

    // GROUPS
    groups.call(this, panelBody);

    actionsBlock.appendChild(closeButton);
    actionsBlock.appendChild(deleteButton);
    actionsBlock.appendChild(successButton);

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
    titleBlock.appendChild(titleLabel);
    titleBlock.appendChild(nameInput);

    iconsBlock.appendChild(iconsHeader);
    iconsBlock.appendChild(iconsLabel);
    iconsBlock.appendChild(iconsInput);
    iconsBlock.appendChild(iconsList);

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

    pathsBlock.appendChild(pathsHeader);
    pathsBlock.appendChild(pathsAddButton);
    pathsBlock.appendChild(pathsList);

    panelBody.appendChild(actionsBlock);
    panelBody.appendChild(titleBlock);
    panelBody.appendChild(iconsBlock);
    panelBody.appendChild(settingsBlock);
    panelBody.appendChild(pathsBlock);

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
      radioButton.checked = true;
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
      const pathsList = this.querySelector('.list-group');
      model.current.paths.forEach(
        (path) => {
          let listItem = document.createElement('li');
          listItem.classList.add('list-item', 'text-info');
          listItem.textContent = path;
          pathsList.appendChild(listItem);
        })
    }
  }
};

const createView = function _createView (model) {
  let options = {
    tagExtends: 'div',
    tagIs: 'project-viewer-form'
  };
  return _constructor.createView(options, viewMethods, model);
};

module.exports = {
  createView: createView
};
