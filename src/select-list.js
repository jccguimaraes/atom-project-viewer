const SelectList = require('atom-select-list');

module.exports = class PVSelectList extends SelectList {

  items () {
    return [];
  }

  viewForItem (item) {
      return item;
  }
}
