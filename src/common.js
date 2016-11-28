'use strict';

const map = require('./map');
const config = require('./config');

/**
 * clear old config settings (a bit of an hack)
*/
const cleanConfig = function _cleanConfig () {
  const values = Object.keys(atom.config.getAll('project-viewer')[0].value);

  values.forEach(
    value => {
      if (config.hasOwnProperty(value)) {
        return;
      }
      atom.config.unset(`project-viewer.${value}`);
    }
  );
};

const getModel = function _getModel (view) {
  if (!view) { return undefined; }
  return map.get(getView(view));
};

const getView = function _getView (view) {
  if (!view) { return undefined; }
  while (view && view.nodeName !== 'LI') {
    view = view.parentNode;
  }
  return view;
};

const buildBlock = function _buildBlock () {
  const view = document.createElement('div');
  view.classList.add('block', 'pv-editor-block');
  return view;
};

const buildHeader = function _buildHeader (text) {
  const view = document.createElement('h2');
  view.textContent = text;
  view.classList.add('pv-editor-header');
  return view;
};

const buildInput = function _buildInput (type, block) {
  const view = document.createElement('input');
  view.setAttribute('type', type);
  view.classList.add(`input-${type}`, `pv-input-${block}`);
  return view;
};

const buildButton = function _buildButton (text, action) {
  const view = document.createElement('button');
  view.textContent = text;
  view.classList.add('inline-block', 'btn', `btn-${action}`);
  return view;
};

const buildLabel = function _buildLabel (text, type, child) {
  const view = document.createElement('label');
  view.classList.add('input-label', `pv-input-label-${type}`);
  const textNode = document.createTextNode(text);
  if (child) { view.appendChild(child); }
  view.appendChild(textNode);
  return view;
};

exports.cleanConfig = cleanConfig;
exports.getModel = getModel;
exports.getView = getView;
exports.buildBlock = buildBlock;
exports.buildHeader = buildHeader;
exports.buildInput = buildInput;
exports.buildButton = buildButton;
exports.buildLabel = buildLabel;
