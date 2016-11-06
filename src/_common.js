'use strict';

/**
*/
const map = require('./_map');
const config = require('./_config');

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

/**
*/
const getModel = function _getModel (view) {
  if (!view) { return undefined; }
  return map.get(getView(view));
};

/**
*/
const getView = function _getView (view) {
  if (!view) { return undefined; }
  while (view && view.nodeName !== 'LI') {
    view = view.parentNode;
  }
  return view;
};

exports.cleanConfig = cleanConfig;
exports.getModel = getModel;
exports.getView = getView;
