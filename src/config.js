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
        description: 'Hability to autohide project viewer.',
        type: 'boolean',
        default: false,
        order: 2
    },
    'hideHeader': {
        description: 'Hide header (for more space).',
        type: 'boolean',
        default: false,
        order: 3
    },
    'githubToken': {
        description: 'Your personal and private GitHub token.<br>This is useful if you want to save/backup your projects to a remote place (as a gist)',
        type: 'string',
        default: '',
        order: 4
    },
    'convertOldData': {
        description: 'If you came from a version previous to <code>0.3.0</code>, you most probably have the old data in the atom folder. By default it will always check on startup for this data and if the new does not exist, it will convert to the new data schema.',
        type: 'boolean',
        default: true,
        order: 5
    }
};

module.exports = config;
