'use strict';

/** atom */
const CompositeDisposable = require('atom').CompositeDisposable;

/* package */
const _caches = require('./caches');
const _constructor = require('./view-constructor');
const _constants = require('./constants.json');

const viewMethods = {
  attachedCallback: function _attachedCallback () {
    this.disposables = new CompositeDisposable();

    let panelBody = document.createElement('div');
    panelBody.classList.add('panel-body');

    // ACTIONS
    let actionsBlock = document.createElement('div');
    actionsBlock.classList.add('block', 'form-block-actions');
    let actionsCloseButton = document.createElement('button');
    actionsCloseButton.classList.add('inline-block', 'btn', 'btn-warning');
    actionsCloseButton.textContent = _constants.form.actions.close.description;
    actionsCloseButton.addEventListener(
      'click',
      () => atom.workspace.getActivePane().destroyActiveItem(),
      false
    );
    let actionsDeleteButton = document.createElement('button');
    actionsDeleteButton.classList.add('inline-block', 'btn', 'btn-error');
    actionsDeleteButton.textContent = _constants.form.actions.delete.description;
    actionsDeleteButton.addEventListener(
      'click',
      () => atom.workspace.getActivePane().destroyActiveItem(),
      false
    );
    let actionsSuccessButton = document.createElement('button');
    actionsSuccessButton.classList.add('pv-actions-success', 'inline-block', 'btn', 'btn-success');
    actionsSuccessButton.textContent = _constants.form.actions.add.description;

    actionsSuccessButton.addEventListener(
      'click',
      () => {
        let name = this.querySelector('.pv-input-name');
        let icon = this.querySelector('.icons-list .btn-success');
        let devMode = this.querySelector('.pv-checkbox-devmode');
        let bulk = this.querySelector('.pv-checkbox-bulk');
        let paths = this.querySelectorAll('.list-group li');

        if (paths) {
          paths = Array.from(paths).map(function (path) {
            return path.textContent;
          });
        } else {
          paths = [];
        }

        const model = _caches.get(this);

        model.setters({
          name: name.getModel().buffer.getText(),
          icon: icon.textContent,
          devMode: devMode.checked,
          bulk: bulk.checked,
          paths: paths
        });
      },
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
    titleHeader.textContent = _constants.form.title.header.description;
    let titleLabel = document.createElement('label');
    titleLabel.textContent = _constants.form.title.label.description;
    titleLabel.classList.add('text-subtle');
    let titleInput = document.createElement('atom-text-editor');
    titleInput.setAttribute('mini', true);
    titleInput.classList.add('pv-input-name');
    titleInput.getModel().placeholderText = _constants.form.title.label.description;

    // ICONS
    let iconsBlock = document.createElement('div');
    iconsBlock.classList.add('block', 'form-block-icons');
    let iconsHeader = document.createElement('h1');
    iconsHeader.textContent = _constants.form.icons.header.description;
    let iconsLabel = document.createElement('label');
    iconsLabel.textContent = _constants.form.icons.label.description;
    iconsLabel.classList.add('text-subtle');
    let iconsInput = document.createElement('atom-text-editor');
    iconsInput.setAttribute('mini', true);
    let iconsList = document.createElement('div');
    let iconsListStyle = atom.config.get('project-viewer.iconListStyle');
    if (iconsListStyle) {
      iconsList.classList.add('block', 'icons-list', 'only-icons');
    } else {
      iconsList.classList.add('block', 'icons-list');
    }
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
        'inline-block-tight',
        'icon',
        icon.pack,
        `${icon.prefix}${icon.name}${icon.suffix}`
      );

      if (iconsListStyle) {
        iconView.textContent = "";
        this.disposables.add(atom.tooltips.add(iconView, {title: icon.description}));
      } else {
        iconView.textContent = icon.description;
      }

      iconView.addEventListener('click', function () {
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
    settingsHeader.textContent = _constants.form.settings.header.description;
    let settingsCheckList = document.createElement('div');
    settingsCheckList.classList.add('block');
    let settingsDevModeLabel = document.createElement('label');
    settingsDevModeLabel.classList.add('input-label');
    settingsDevModeLabel.innerHTML = _constants.form.settings.devMode.description;
    let settingsDevModeCheckBox = document.createElement('input');
    settingsDevModeCheckBox.classList.add('pv-checkbox-devmode', 'input-checkbox');
    settingsDevModeCheckBox.setAttribute('type', 'checkbox');
    let settingsDevModeInfo = document.createElement('span');
    settingsDevModeInfo.classList.add('icon', 'octicon', 'octicon-question', 'inline-block', 'text-info');
    atom.tooltips.add(
      settingsDevModeInfo,
      {
        title: _constants.form.settings.devMode.details,
        delay: {
          show: 100,
          hide: 100
        }
      }
    )
    let settingsBulkLabel = document.createElement('label');
    settingsBulkLabel.classList.add('input-label');
    settingsBulkLabel.innerHTML = _constants.form.settings.bulk.description;
    let settingsBulkCheckBox = document.createElement('input');
    settingsBulkCheckBox.classList.add('pv-checkbox-bulk', 'input-checkbox');
    settingsBulkCheckBox.setAttribute('type', 'checkbox');
    let settingsBulkInfo = document.createElement('span');
    settingsBulkInfo.classList.add('icon', 'octicon', 'octicon-question', 'inline-block', 'text-info');
    atom.tooltips.add(
      settingsBulkInfo,
      {
        title: _constants.form.settings.bulk.details,
        delay: {
          show: 100,
          hide: 100
        }
      }
    )

    // PATHS
    let pathsBlock = document.createElement('div');
    pathsBlock.classList.add('block', 'form-block-paths');
    let pathsHeader = document.createElement('h1');
    pathsHeader.textContent = _constants.form.paths.header.description;
    let pathsAddButton = document.createElement('button');
    pathsAddButton.classList.add('btn', 'btn-primary', 'icon', 'icon-file-directory');
    pathsAddButton.textContent = _constants.form.paths.add.description;
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

    actionsBlock.appendChild(actionsCloseButton);
    actionsBlock.appendChild(actionsDeleteButton);
    actionsBlock.appendChild(actionsSuccessButton);

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
    titleBlock.appendChild(titleInput);

    iconsBlock.appendChild(iconsHeader);
    iconsBlock.appendChild(iconsLabel);
    iconsBlock.appendChild(iconsInput);
    iconsBlock.appendChild(iconsList);

    settingsDevModeLabel.insertBefore(
      settingsDevModeCheckBox,
      settingsDevModeLabel.firstChild
    );
    settingsBulkLabel.insertBefore(
      settingsBulkCheckBox,
      settingsBulkLabel.firstChild
    );
    settingsDevModeLabel.appendChild(settingsDevModeInfo);
    settingsBulkLabel.appendChild(settingsBulkInfo);
    settingsCheckList.appendChild(settingsDevModeLabel);
    settingsCheckList.appendChild(settingsBulkLabel);
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
    return 'Project Viewer Creator'
  },
  render: function _render () {
    let model = _caches.get(this);

    if (!model || !model.current) {
      return;
    }

    if (model.current.hasOwnProperty('uuid')) {
      const actionsSuccessButton = this.querySelector('.pv-actions-success');
      actionsSuccessButton.textContent = _constants.form.actions.update.description;
    }

    if (model.current.hasOwnProperty('type')) {
      const radioButton = this.querySelector(`.pv-form-radio-${model.current.type} input`);
      radioButton.checked = true;
    }

    if (model.current.hasOwnProperty('name')) {
      const titleInput = this.querySelector('.pv-input-name');
      titleInput.getModel().buffer.setText(model.current.name);
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

    if (model.current.hasOwnProperty('color')) {}

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
