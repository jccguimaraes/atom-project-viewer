'use strict';

const editor = Object.create(null);

const getTitle = function _getTitle () {
  return 'PV Editor';
};

editor.getTitle = getTitle;

module.exports = editor;
