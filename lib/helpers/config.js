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
    }
};

module.exports = Config;
