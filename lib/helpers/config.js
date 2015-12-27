'use strict';

var Config = {
    startUp: {
        title: 'Setup initial visibility',
        description: 'Set if **project-viewer** panel should be visible from the start up',
        type: 'boolean',
        default: false,
        order: 1
    },
    openBuffers: {
        title: 'Open buffered files',
        description: 'Every time you open a file that\'s relative to any of the paths of the project, it will be buffered until you close it manually. Every time you switch projects, they will be restored (setting to **true** will **close** none project files!)',
        type: 'boolean',
        default: false,
        order: 2
    },
    foldersCollapsed: {
        title: 'Folders collapsed',
        description: 'Defines if first level folders should always be collapsed when switching/opening the project.',
        type: 'boolean',
        default: false,
        order: 3
    },
    onlyGroupColors: {
        title: 'Color only groups',
        description: 'If set to true, will only color the group and not the projects.',
        type: 'boolean',
        default: false,
        order: 4
    }
};

module.exports = Config;
