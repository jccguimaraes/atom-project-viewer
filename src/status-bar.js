'use strict';

const map = require('./map');

const update = function _update (text) {
  if (!text) { return; }
  const item = statusBar.view.getItem();
  item.textContent = text;
};

const toggle = function _toggle (value) {
  const service = map.get(this);
  let item;
  if (!statusBar.view) {
    item = document.createElement('div');
    item.classList.add('inline-block', 'pv-status-bar');
    statusBar.view = service.addRightTile({ item });
  }

  statusBar.view.destroy();

  if (value) {
    statusBar.view = service.addRightTile({
      item: statusBar.view.getItem()
    });
  }
};

const statusBar = Object.create(null);

statusBar.update = update;
statusBar.toggle = toggle;

module.exports = statusBar;
