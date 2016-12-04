'use strict';

const selectListView = require('atom-space-pen-views').SelectListView;

const selectList = new selectListView();

const initialize = function _initialize () {
  this.element.classList.add('pv-has-icons');

  if (!this.panel) {
    this.panel = atom.workspace.addModalPanel({
      item: this,
      visible: false
    });
  }

  this.getEmptyMessage('couldn\'t find any projects');
};

const togglePanel = function _togglePanel () {
  if (!this.panel) { return; }

  if (this.panel.isVisible()) {
    this.panel.hide();
  } else {
    this.populateList();
    this.panel.show();
    this.storeFocusedElement();
    this.focusFilterEditor();
  }
};

const viewForItem = function _viewForItem (model) {
  let icon = '';
  if (model.icon.startsWith('devicons-')) {
    icon = 'devicons' + ' ' + model.icon;
  }
  else if (model.icon.startsWith('icon-')) {
    icon = 'icon' + ' ' + model.icon;
  }
  return `<li class="two-lines">
  <div class="primary-line ${icon}">${model.name}</div>
  <div class="secondary-line no-icon">${model.breadcrumb()}</div>
  </li>`
};

const getFilterKey = function _getFilterKey () {
  return 'name';
};

const confirmed = function confirmed (model) {
  const view = document.querySelector(`li[data-project-viewer-uuid="${model.uuid}"]`);
  if (!view) { return; }
  view.openOnWorkspace();
};

const cancelled = function _cancelled () {
  if (this.panel && this.panel.isVisible()) {
    this.panel.hide();
  }
};

const confirmSelection = function _confirmSelection () {
  const item = this.getSelectedItem();
  if (item) {
    this.confirmed(item);
  }
  if (this.panel && this.panel.isVisible()) {
    this.cancel();
  }
};

const cancelSelection = function _cancelSelection () {
  if (this.panel && this.panel.isVisible()) {
    this.cancel();
  }
};

const populate = function _populate (models) {
  const items = models.filter(function (model) {
    return model.type === 'project';
  });
  this.setItems(items);
};

selectList.initialize = initialize;
selectList.togglePanel = togglePanel;
selectList.viewForItem = viewForItem;
selectList.populate = populate;
selectList.confirmed = confirmed;
selectList.confirmSelection = confirmSelection;
selectList.cancelled = cancelled;
selectList.cancelSelection = cancelSelection;
selectList.getFilterKey = getFilterKey;

module.exports = selectList;
