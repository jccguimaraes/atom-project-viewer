'use strict';

const model = require('./model');
const group = require('./group-view');
const item = require('./item-view');
const form = require('./form');
const formView = require('./form-view');

module.exports = {
  model: {
    createGroup: model.createGroup,
    createItem: model.createItem,
    createForm: form.createModel
  },
  view: {
    createGroup: group.createView,
    createItem: item.createView,
    createForm: formView.createView
  },
  ui: {
    attach: function _attach (childNode, parentNode) {
      if (!parentNode || typeof parentNode.attachChild !== 'function') {
        return;
      }
      parentNode.attachChild(childNode);
    },
    detach: function _detach (childNode, parentNode) {
      if (!parentNode || typeof parentNode.detachChild !== 'function') {
        return;
      }
      parentNode.detachChild(childNode);
    }
  }
};