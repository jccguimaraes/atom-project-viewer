'use strict';

const config = {
  'visibilityOption': {
    title: 'Panel visibility interaction option',
    description: 'Define what would be the default action for **project-viewer** visibility on startup.',
    type: 'string',
    default: 'Display on startup',
    enum: [
      'Display on startup',
      'Remember state'
    ],
    order: 0
  },
  'visibilityActive': {
    title: 'Panel visibility interaction state',
    description: 'Relative to the interaction option selected above.',
    type: 'boolean',
    default: true,
    order: 1
  },
  'panelPosition': {
    title: 'Panel Position',
    description: 'Position the panel to the left or right of the main pane.',
    type: 'string',
    default: 'Right',
    enum: [
      'Left',
      'Right'
    ],
    order: 2
  }
};

module.exports = config;
