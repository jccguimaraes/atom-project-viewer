'use strict';

const _caches = require('./caches');
const _constructor = require('./view-constructor');

const viewMethods = {
  attachedCallback: function _attachedCallback () {
    let panelBody = document.createElement('div');
    panelBody.classList.add('panel-body');

    let actionsBlock = document.createElement('div');
    actionsBlock.classList.add('block', 'form-actions-block');
    let actionsCancelButton = document.createElement('button');
    actionsCancelButton.classList.add('inline-block', 'btn', 'btn-error');
    actionsCancelButton.textContent = 'Cancel';
    let actionsSuccessButton = document.createElement('button');
    actionsSuccessButton.classList.add('inline-block', 'btn', 'btn-success');
    actionsSuccessButton.textContent = 'Add / Update';

    let titleBlock = document.createElement('div');
    titleBlock.classList.add('block', 'form-title-block');
    let titleLabel = document.createElement('label');
    titleLabel.textContent = 'Enter the name for the group / item';
    let titleInput = document.createElement('atom-text-editor');
    titleInput.setAttribute('mini', true);

    let settingsBlock = document.createElement('div');
    settingsBlock.classList.add('block', 'form-settings-block');
    let settingsDevModeLabel = document.createElement('label');
    settingsDevModeLabel.classList.add('input-label');
    settingsDevModeLabel.innerHTML = ' Run in <i>Dev Mode</i>';
    let settingsDevModeCheckBox = document.createElement('input');
    settingsDevModeCheckBox.classList.add('input-checkbox');
    settingsDevModeCheckBox.setAttribute('type', 'checkbox');

    actionsBlock.appendChild(actionsCancelButton);
    actionsBlock.appendChild(actionsSuccessButton);

    titleBlock.appendChild(titleLabel);
    titleBlock.appendChild(titleInput);

    settingsDevModeLabel.insertBefore(settingsDevModeCheckBox, settingsDevModeLabel.firstChild);
    settingsBlock.appendChild(settingsDevModeLabel);

    panelBody.appendChild(actionsBlock);
    panelBody.appendChild(titleBlock);
    panelBody.appendChild(settingsBlock);

    this.appendChild(panelBody);
  },
  getTitle: function _getTitle () {
    return 'Project Viewer Form'
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
