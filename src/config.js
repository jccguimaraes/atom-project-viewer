'use strict';

const config = {
    'visibilityState': {
      description: 'Define what would be the default action for **project-viewer** visibility on startup.',
      type: 'string',
      default: 'Display on startup',
      enum: [
        'Display on startup',
        'Remember state'
      ],
      order: 0
    },
    'visibilityAction': {
      description: 'This `boolean` is relative to the option selected in `Visibility State`.',
        type: 'boolean',
        default: true,
        order: 1
    },
    'statusBarVisibility': {
        description: 'Define if you want **project-viewer** to show active *group* and *project* in the `status-bar`.',
        type: 'boolean',
        default: false,
        order: 2
    },
    'autohide': {
        description: 'Ability to autohide project viewer.',
        type: 'boolean',
        default: false,
        order: 3
    },
    'panelPosition': {
        title: 'Position of the panel',
        description: 'You can set the position of the sidebar, to the right or the left side of the text editor.',
        type: 'string',
        default: 'Right',
        enum: ['Left', 'Right'],
        order: 4
    },
    'alwaysOpenInNewWindow': {
        description: 'If set to true, always open projects in a new window (default Atom\'s behavior), instead of opening in the same window.',
        type: 'boolean',
        default: false,
        order: 5
    },
    'hideHeader': {
        description: 'Hide header (for more space).',
        type: 'boolean',
        default: false,
        order: 6
    },
    'githubAccessToken': {
        title: 'GitHub Access Token',
        description: 'Your personal and private GitHub access token. This is useful if you want to save/backup your projects to a remote place (as a gist). *note*: keep in mind that this token should have only permissions to `rw` gists as well as that any package can access this token string.',
        type: 'string',
        default: '',
        order: 7
    },
    'gistId': {
        title: 'Gist ID',
        description: 'ID of the gist used as a backup storage.',
        type: 'string',
        default: '',
        order: 8
    },
    'setName': {
        description: 'Name of your working set, for example \'work\' or \'home\'. As each working set is backed up into a separate file in gist, you can have multiple Client/Group/Project sets on different machines and have them all safely backed up on gist.',
        type: 'string',
        default: 'default',
        order: 9
    },
    'convertOldData': {
        description: 'If you came from a version previous to <code>0.3.0</code>, you most probably have the old data in the atom folder. By default, it will always check on startup for this data and if the new does not exist, it will convert to the new data schema.',
        type: 'boolean',
        default: false,
        order: 10
    },
    'keepContext': {
        description: 'Keep context between project switching.',
        type: 'boolean',
        default: false,
        order: 11
    },
    'customWidth': {
        description: 'Set a custom panel width',
        type: 'number',
        default: 180,
        order: 12
    },
    'customSelectedColor': {
        description: 'Only allows for hexadecimal colors',
        type: 'string',
        default: '',
        order: 13
    },
    'customHoverColor': {
        description: 'Only allows for hexadecimal colors',
        type: 'string',
        default: '',
        order: 14
    },
    'customTitleColor': {
        description: 'Only allows for hexadecimal colors',
        type: 'string',
        default: '',
        order: 15
    },
    'onlyIcons': {
      description: 'Show the icons without the description.',
      type: 'boolean',
      default: false,
      order: 16
    }
};

module.exports = config;
