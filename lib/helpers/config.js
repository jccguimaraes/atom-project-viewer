'use strict';

var Config = {
    startUp: {
        title: 'Setup initial visibility',
        description: 'Set if **project-viewer** panel should be visible from the start up',
        type: 'boolean',
        default: false,
        order: 1
    },
    panelPosition: {
        title: 'Position of the panel',
        description: 'You can set the place of the viewer, to the most right position or to the most left position',
        type: 'string',
        default: 'Right',
        enum: ['Left', 'Right'],
        order: 2
    },
    openBuffers: {
        title: 'Open buffered files',
        description: 'Every time you open a file that\'s relative to any of the paths of the project, it will be buffered until you close it manually. Every time you switch projects, they will be restored (setting to **true** will **close** none project files!)',
        type: 'boolean',
        default: false,
        order: 3
    },
    foldersCollapsed: {
        title: 'Folders collapsed',
        description: 'Defines if first level folders should always be collapsed when switching/opening the project.',
        type: 'boolean',
        default: false,
        order: 4
    },
    onlyGroupColors: {
        title: 'Color only groups',
        description: 'If set to true, will only color the group and not the projects.',
        type: 'boolean',
        default: false,
        order: 5
    }
};

module.exports = Config;
