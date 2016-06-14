'use strict';

const config = {
    'startupVisibility': {
        description: 'Define if you want **project-viewer** to be visible on startup.',
        type: 'boolean',
        default: false,
        order: 0
    },
    'statusBarVisibility': {
        description: 'Define if you want **project-viewer** to show active *group* and *project*.',
        type: 'boolean',
        default: false,
        order: 1
    },
    'autohide': {
        description: 'Ability to autohide project viewer.',
        type: 'boolean',
        default: false,
        order: 2
    },
    'panelPosition': {
        title: 'Position of the panel',
        description: 'You can set the position of the sidebar, to the right or the left side of the text editor.',
        type: 'string',
        default: 'Right',
        enum: ['Left', 'Right'],
        order: 3
    },
    'alwaysOpenInNewWindow': {
        description: 'If set to true, always open projects in a new window (default Atom\'s behavior), instead of opening in the same window.',
        type: 'boolean',
        default: false,
        order: 4
    },
    'hideHeader': {
        description: 'Hide header (for more space).',
        type: 'boolean',
        default: false,
        order: 5
    },
    'githubToken': {
        description: 'Your personal and private GitHub token. This is useful if you want to save/backup your projects to a remote place (as a gist). *note*: keep in mind that this token should have only permissions to `rw` gists as well as that any package can access this token string.',
        type: 'string',
        default: '',
        order: 6
    },
    'convertOldData': {
        description: 'If you came from a version previous to <code>0.3.0</code>, you most probably have the old data in the atom folder. By default, it will always check on startup for this data and if the new does not exist, it will convert to the new data schema.',
        type: 'boolean',
        default: true,
        order: 7
    }
};

module.exports = config;
