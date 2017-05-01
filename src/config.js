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
    default: 'Right (last)',
    enum: [
      'Left (first)',
      'Left (last)',
      'Right (first)',
      'Right (last)'
    ],
    order: 2
  },
  'autoHide': {
    title: 'Sidebar auto hidding',
    description: 'Panel has auto hide with hover behavior.',
    type: 'boolean',
    default: false,
    order: 3
  },
  'autoHideAbsolute': {
    title: 'Makes the Sidebar auto hidding as an absolute',
    description: 'This will not make the workspace change width.',
    type: 'boolean',
    default: false,
    order: 4
  },
  'hideHeader': {
    title: 'Hide the header',
    description: 'You can have more space for the list by hiding the header.',
    type: 'boolean',
    default: false,
    order: 5
  },
  'keepContext': {
    title: 'Keep Context',
    description: 'When switching from items, if set to `true`, will keep current context. Also will not save contexts between switching.',
    type: 'boolean',
    default: false,
    order: 6
  },
  'openNewWindow': {
    title: 'Open in a new window',
    description: 'Always open items in a new window.',
    type: 'boolean',
    default: false,
    order: 7
  },
  'statusBar': {
    title: 'Show current project in the status-bar',
    description: 'Will show the breadcrumb to the current opened project in the `status-bar`.',
    type: 'boolean',
    default: false,
    order: 8
  },
  'customWidth': {
    title: 'Set a custom panel width',
    description: 'Define a custom width for the panel.<br>*double clicking* on the resizer will reset the width',
    type: 'number',
    default: 200,
    order: 9
  },
  'rootSortBy': {
    title: 'Root SortBy',
    description: 'Sets the root sort by',
    type: 'string',
    default: 'position',
    enum: [
      'position',
      'reverse-position',
      'alphabetically',
      'reverse-alphabetically'
    ],
    order: 10
  },
  'githubAccessToken': {
    title: 'GitHub Access Token',
    description: 'Your personal and private GitHub access token. This is useful if you want to save/backup your projects to a remote place (as a gist). *note*: keep in mind that this token should have only permissions to `rw` gists as well as that any package can access this token string.',
    type: 'string',
    default: '',
    order: 11
  },
  'gistId': {
    title: 'Gist ID',
    description: 'ID of the gist used as a backup storage.',
    type: 'string',
    default: '',
    order: 12
  },
  'setName': {
    description: 'Name of your working set, for example \'work\' or \'home\'. As each working set is backed up into a separate file in gist, you can have multiple Group/Project sets on different machines and have them all safely backed up on gist.',
    type: 'string',
    default: 'default',
    order: 13
  },
  'onlyIcons': {
    title: 'Icons list without description',
    description: 'Will show only the icons in the icon\'s list',
    type: 'boolean',
    default: true,
    order: 14
  },
  'customPalette': {
    title: 'Custom palette to use on editor',
    description: 'This can be filled with custom colors',
    type: 'array',
    default: ['#F1E4E8', '#F7B05B', '#595959', '#CD5334', '#EDB88B', '#23282E', '#263655',
    '#F75468', '#FF808F', '#FFDB80', '#292E1E', '#248232', '#2BA84A', '#D8DAD3',
    '#FCFFFC', '#8EA604', '#F5BB00', '#EC9F05', '#FF5722', '#BF3100'],
    items: {
      type: 'string'
    },
    order: 15
  },
  'customSelectedColor': {
    description: 'Only allows for hexadecimal colors',
    type: 'string',
    default: '',
    order: 16
  },
  'customHoverColor': {
    description: 'Only allows for hexadecimal colors',
    type: 'string',
    default: '',
    order: 17
  },
  'customTitleColor': {
    description: 'Only allows for hexadecimal colors',
    type: 'string',
    default: '',
    order: 18
  },
  'disclaimer': {
    title: 'Show release notes on startup',
    type: 'object',
    properties: {
      'v1014': {
        title: "for v1.0.14",
        type: 'boolean',
        default: true
      }
    },
    order: 19
  }
};

module.exports = config;
