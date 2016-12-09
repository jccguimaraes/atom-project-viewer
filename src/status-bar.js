'use strict';

const map = require('./map');

const update = function _update (text) {
  if (!text) { return; }
  const service = map.get(this);
  if (!statusBar.view) {
    const view = document.createElement('div');
    view.classList.add('inline-block');
    statusBar.view = service.addRightTile({
      item: view
    });
  }
  const item = statusBar.view.getItem();
  if (item) {
    item.textContent = text;
  }
};
const toggle = function _toggle () {};

const statusBar = Object.create(null);

statusBar.update = update;
statusBar.toggle = toggle;

module.exports = statusBar;
