const config = {
  'dockOrPanel': {
    title: 'Old Panel integration versus Dock',
    description: 'If you want to use the old panel integration, just leave uncheck',
    type: 'boolean',
    default: false,
    order: 0
  },
  'visibilityOption': {
    title: 'Panel visibility interaction option',
    description: 'Define what would be the default action for **project-viewer** visibility on startup.',
    type: 'string',
    default: 'Display on startup',
    enum: [
      'Display on startup',
      'Remember state'
    ],
    order: 1
  },
  'visibilityActive': {
    title: 'Panel visibility interaction state',
    description: 'Relative to the interaction option selected above.',
    type: 'boolean',
    default: true,
    order: 2
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
    order: 3
  },
  'autoHide': {
    title: 'Sidebar auto hidding',
    description: 'Panel has auto hide with hover behavior.',
    type: 'boolean',
    default: false,
    order: 4
  },
  'autoHideAbsolute': {
    title: 'Makes the Sidebar auto hidding as an absolute',
    description: 'This will not make the workspace change width.',
    type: 'boolean',
    default: false,
    order: 5
  },
  'hideHeader': {
    title: 'Hide the header',
    description: 'You can have more space for the list by hiding the header.',
    type: 'boolean',
    default: false,
    order: 6
  },
  'keepContext': {
    title: 'Keep Context',
    description: 'When switching from items, if set to `true`, will keep current context. Also will not save contexts between switching.',
    type: 'boolean',
    default: false,
    order: 7
  },
  'keepWindowSize': {
    title: 'Keep Window Size',
    description: 'When changing projects, if set to `true`, the window size will not change.',
    type: 'boolean',
    default: false,
    order: 7
  },
  'openNewWindow': {
    title: 'Open in a new window',
    description: 'Always open items in a new window.',
    type: 'boolean',
    default: false,
    order: 8
  },
  'statusBar': {
    title: 'Show current project in the status-bar',
    description: 'Will show the breadcrumb to the current opened project in the `status-bar`.',
    type: 'boolean',
    default: false,
    order: 9
  },
  'customWidth': {
    title: 'Set a custom panel width',
    description: 'Define a custom width for the panel.<br>*double clicking* on the resizer will reset the width',
    type: 'number',
    default: 200,
    order: 10
  },
  'customHotZone': {
    title: 'Set a custom hot zone width',
    description: 'Cursor movement within this width will make a hidden panel appear',
    type: 'number',
    default: 20,
    order: 10
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
    order: 11
  },
  'githubAccessToken': {
    title: 'GitHub Access Token',
    description: 'Your personal and private GitHub access token. This is useful if you want to save/backup your projects to a remote place (as a gist). *note*: keep in mind that this token should have only permissions to `rw` gists as well as that any package can access this token string.',
    type: 'string',
    default: '',
    order: 12
  },
  'gistId': {
    title: 'Gist ID',
    description: 'ID of the gist used as a backup storage.',
    type: 'string',
    default: '',
    order: 13
  },
  'setName': {
    description: 'Name of your working set, for example \'work\' or \'home\'. As each working set is backed up into a separate file in gist, you can have multiple Group/Project sets on different machines and have them all safely backed up on gist.',
    type: 'string',
    default: 'default',
    order: 14
  },
  'onlyIcons': {
    title: 'Icons list without description',
    description: 'Will show only the icons in the icon\'s list',
    type: 'boolean',
    default: true,
    order: 15
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
    order: 16
  },
  'customSelectedColor': {
    description: 'Only allows for hexadecimal colors',
    type: 'string',
    default: '',
    order: 17
  },
  'customHoverColor': {
    description: 'Only allows for hexadecimal colors',
    type: 'string',
    default: '',
    order: 18
  },
  'customTitleColor': {
    description: 'Only allows for hexadecimal colors',
    type: 'string',
    default: '',
    order: 19
  },
  'packagesReload': {
    title: 'List of packages to reload',
    description: 'This is an attempt to reload any package that stays in the *limbo* of the context switching\n\nExample: pigments, colorio\n\n **Keep in mind that some packages could not work properly. If this happens, please contact me via a feature issue asking to investigate**',
    type: 'array',
    default: [],
    items: {
      type: 'string'
    },
    order: 20
  },
  'disclaimer': {
    title: 'Show release notes on startup',
    type: 'object',
    properties: {
      'v130': {
        title: "for v1.3.0",
        type: 'boolean',
        default: true
      }
    },
    order: 21
  }
};

module.exports = config;
