'use strict';

const TOPIC = 'Project Viewer',
    EMITTERS = {
        PROJECTS: {
            onDidSetName: 'project-viewer:on-did-set-name',
            onDidSetPaths: 'project-viewer:on-did-set-paths'
        },
        onDidAddFile: 'project-viewer:on-did-add-file',
        onDidCloseFile: 'project-viewer:on-did-close-file'
    };

module.exports = {
    TOPIC,
    EMITTERS
};
