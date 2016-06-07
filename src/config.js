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
    panelPosition: {
        title: 'Position of the panel',
        description: 'You can set the place of the viewer, to the most right position or to the most left position.',
        type: 'string',
        default: 'Right',
        enum: ['Left', 'Right'],
        order: 3
    },
    'hideHeader': {
        description: 'Hide header (for more space).',
        type: 'boolean',
        default: false,
        order: 4
    },
    'githubToken': {
        description: 'Your personal and private GitHub token. This is useful if you want to save/backup your projects to a remote place (as a gist). *note*: keep in mind that this token should have only permissions to `rw` gists as well as that any package can access this token string.',
        type: 'string',
        default: '',
        order: 5
    },
    'convertOldData': {
        description: 'If you came from a version previous to <code>0.3.0</code>, you most probably have the old data in the atom folder. By default it will always check on startup for this data and if the new does not exist, it will convert to the new data schema.',
        type: 'boolean',
        default: true,
        order: 6
    }
};

module.exports = config;
