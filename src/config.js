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
        description: 'Your personal and private GitHub token',
        type: 'string',
        default: '',
        order: 4
    }
};

module.exports = config;
