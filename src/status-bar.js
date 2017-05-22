const map = require('./map');

const update = function _update (text) {
  if (!text) { return; }
  if (!statusBar.view || typeof statusBar.view.getItem !== 'function') {
    return;
  }
  const item = statusBar.view.getItem();
  if (!item) { return; }
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
