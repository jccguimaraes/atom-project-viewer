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
  },
  'autoHide': {
    title: 'Sidebar auto hidding',
    description: 'Panel has auto hide with hover behaviour.',
    type: 'boolean',
    default: false,
    order: 3
  },
  'hideTitle': {
    title: 'Hide title of this package',
    description: 'You can have more space for the `tree list` by hiding the title.',
    type: 'boolean',
    default: false,
    order: 4
  },
  'keepContext': {
    title: 'Keep Context',
    description: 'When switching from items, if set to `true`, will keep current context. Also will not save contexts between switching.',
    type: 'boolean',
    default: false,
    order: 5
  },
  'openNewWindow': {
    title: 'Open in new window',
    description: 'Always open items in a new window.',
    type: 'boolean',
    default: false,
    order: 6
  },
  'statusBar': {
    title: 'Show current project in the status-bar',
    description: 'Will show the breadcrumb to the current opened project in the `status-bar`.',
    type: 'boolean',
    default: false,
    order: 7
  }
};

module.exports = config;
