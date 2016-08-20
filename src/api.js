'use strict';

const model = require('./model');
const group = require('./group-view');
const item = require('./item-view');

module.exports = {
  model: {
    createGroup: model.createGroup,
    createItem: model.createItem
  },
  view: {
    createGroup: group.createView,
    createItem: item.createView
  }
};
