'use strict';

const storage = atom.getStorageFolder().load('project-viewer2.json');
const clientsMap = new WeakMap();
const groupsMap = new WeakMap();
const projectsMap = new WeakMap();

module.exports = {
    clientsMap: clientsMap,
    groupsMap: groupsMap,
    projectsMap: projectsMap,
    storage: storage
};
