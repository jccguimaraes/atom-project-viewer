'use strict';

const caches = require('./caches');
const database = require('./database');

const toArray = function _toArray (list, fnMap) {
  return Array.from(list, fnMap);
};

const getModel = function _getModel (view) {
    if (!view) { return; }
  let model = caches.get(view);
  let safeCycle = 0;
  while (!model && safeCycle < 3) {
    view = view.parentNode;
    model = caches.get(view);
    safeCycle++;
  }
  return model;
};

const getView = function _getView (model) {
  return document.body.querySelector(
    `li[data-project-viewer-uuid="${model.uuid}"]`
  );
};

const clearAllItemsState = function _clearAllItemsState (list) {
  const items = list || database.getListOf('items');
  items.forEach(
    item => {
      let sha = atom.getStateKey(item.model.paths);
      const content = atom.getStorageFolder().load(sha);
      if (content) {
        atom.getStorageFolder().storeSync(sha, null);
      }
      if (item.view.classList.contains('selected')) {
        atom.workspace.destroyActivePane();
      }
    }
  );
};

const updateStatusBar = function _updateStatusBar (text) {
  let model;
  let selectedView;

  const statusBar = document.querySelector('status-bar');
  if (!statusBar) { return; }

  let statusBarView = statusBar.querySelector('.pv-status-bar');

  const statusBarService = caches.get(statusBar);
  if (!statusBarService) { return; }

  if (!atom.config.get('project-viewer.statusBar')) {
    statusBarService.getRightTiles().forEach(
      tile => {
        if (statusBarView && tile.getItem() === statusBarView) {
          tile.destroy()
        }
      }
    )
    return;
  }

  if (!text) {
    selectedView = document.querySelector(
      'project-viewer li[is="project-viewer-list-item"].selected'
    );
  }

  if (selectedView) {
    model = caches.get(selectedView);
  }

  if (model) {
    text = model.breadcrumb();
  }

  if (!statusBarView) {
    statusBarView = document.createElement('div', 'status-bar-file');
    statusBarView.classList.add(
      'inline-block',
      'pv-status-bar'
    );
    statusBarService.addRightTile({
      item: statusBarView
    });
  }

  statusBarView.textContent = text;
};

exports.toArray = toArray;
exports.getModel = getModel;
exports.getView = getView;
exports.clearAllItemsState = clearAllItemsState;
exports.updateStatusBar = updateStatusBar;
