'use strict';

const Fs = require('fs');
const Path = require('path');
const _utils = require('./utils');
const pkg = 'project-viewer';
const file = `${pkg}.json`;
const oldFile = `${pkg}.json`;
let storage;
const mapper = new WeakMap();
const views = {
    clients: [],
    groups: [],
    projects: []
};
const info = {
    version: '0.3.0',
    name: 'project-viewer'
};
const defaultStorage = {
    clients: [],
    groups: [],
    projects: []
};
const oldFilePath = Path.normalize(
    Path.join(atom.getConfigDirPath(), oldFile)
);

const getContent = function getContent () {
    return atom.getStorageFolder().load(file) || defaultStorage;
};

const readData = function readData () {
    const promise = new Promise((resolve, reject) => {
        if (!atom.config.get(getConfig('convertOldData'))) {
            storage = getContent();
            resolve();
            return;
        }

        Fs.access(oldFilePath, Fs.R_OK, (error) => {
            if (error) {
                resolve({
                    type: 'info',
                    message: `Previous data file not found!<br>Nothing to import...<br>Please consider going to <code>Settings -> Packages -> Project-Viewer -> convertOldData</code> and setting it to <code>false</code>.`,
                    options: {
                        icon: 'database'
                    }
                });
                storage = getContent();
                return;
            }

            Fs.readFile(oldFilePath, 'utf8', (error, data) => {
                if (error) {
                    reject({
                        type: 'error',
                        message: 'There were problems reading old content :\\',
                        options: {
                            icon: 'database'
                        }
                    });
                    storage = getContent();
                    return;
                }

                let content = '';

                try {
                    content = JSON.parse(data);
                } catch (e) {
                    reject({
                        type: 'error',
                        message: 'There were problems parsing old content :\\',
                        options: {
                            icon: 'database'
                        }
                    });
                    storage = getContent();
                    return;
                }

                let converted = getContent();

                if (content.hasOwnProperty('groups')) {
                    content.groups.forEach((storedGroup) => {
                        const group = {
                            'name': storedGroup.name || '',
                            'icon': storedGroup.icon || '',
                            'color': storedGroup.color || '',
                            'expanded': storedGroup.expanded || '',
                            'sortBy': 'position',
                            'projects': []
                        }
                        if (!converted) {
                            converted = defaultStorage;
                        }
                        if (converted.groups.length === 0) {
                            converted.groups.push(group);
                        }
                        else if(!converted.groups.some((groupAlreadyIn) => {
                            return groupAlreadyIn.name === group.name;
                        })) {
                            converted.groups.push(group);
                        }

                        if (content.hasOwnProperty('projects')) {
                            content.projects.forEach((storedProject) => {
                                if (storedProject.group !== group.name) {
                                    return;
                                }
                                const project = {
                                    'name': storedProject.name || '',
                                    'icon': storedProject.icon || '',
                                    'dev': storedProject.dev || false,
                                    'paths': Object.keys(storedProject.paths) || []
                                }
                                if (converted.projects.length === 0) {
                                    group.projects.push(project);
                                }
                                else if (!converted.projects.some((projectAlreadyIn) => {
                                    return projectAlreadyIn.name === project.name;
                                })) {
                                    group.projects.push(project);
                                }
                            });
                        }
                    });
                }
                storage = converted;

                atom.getStorageFolder().storeSync(file, storage);

                resolve({
                    type: 'success',
                    message: `<strong>Successfully</strong> converted old data to the new data schema!<br>Please consider going to <code>Settings -> Packages -> Project-Viewer -> convertOldData</code> and setting it to <code>false</code> or even <code>Packages -> Project-Viewer -> File - Delete old file</code>.`,
                    options: {
                        icon: 'database'
                    }
                });
            });
        });
    });
    return promise;
}

const getConfig = function getConfig(config) {
    return pkg.concat('.', config);
};

const buildData = function buildData () {
    const listNestedTrees = document.querySelectorAll('project-viewer li');
    let list = {};
    let data = {
        clients: [],
        groups: [],
        projects: []
    };

    views.projects = [];

    for (let nestedIdx = 0; nestedIdx < listNestedTrees.length; nestedIdx++) {
        let itemDOM = listNestedTrees[nestedIdx];
        let model = mapper.get(itemDOM);

        if (!model) {
            return;
        }

        let item = {};

        if (model.type === 'client') {
            item = {
                name: model.clientName,
                icon: model.clientIcon || '',
                color: model.clientColor || '',
                expanded: model.clientExpanded || false,
                sortBy: model.sortBy || 'position',
                groups: [],
                projects: []
            };
            list[model.clientId] = item;
        }
        else if (model.type === 'group') {
            item = {
                name: model.groupName,
                icon: model.groupIcon || '',
                color: model.groupColor || '',
                expanded: model.groupExpanded || false,
                sortBy: model.sortBy || 'position',
                projects: []
            };
            list[model.groupId] = item;
        }
        else if (model.type === 'project') {
            item = {
                name: model.projectName,
                icon: model.projectIcon || '',
                paths: model.projectPaths || [],
                dev: model.projectDev || false
            };
            list[model.projectId] = item;
            views.projects.push(model.projectId);
        }

        if (model.type === 'client') {
            data.clients.push(item);
        }
        else if (model.type === 'group' && !model.clientName) {
            data.groups.push(item);
        }
        else if (model.type === 'group' && model.clientName) {
            list[model.clientId].groups.push(item);
        }
        else if (model.type === 'project' && !model.clientName && !model.groupName) {
            data.projects.push(item);
        }
        else if (model.type === 'project' && model.groupName) {
            list[model.groupId].projects.push(item);
        }
        else if (model.type === 'project' && model.clientName) {
            list[model.clientId].projects.push(item);
        }
    }
    return data;
}

const store = function store() {
    storage = buildData();
    atom.getStorageFolder().storeSync(file, storage);
    return storage;
};

const setStorage = function setStorage (data) {
    atom.getStorageFolder().storeSync(file, data);
}

const getStorage = function getStorage () {
    return storage;
}

const deleteOldFile = function deleteOldFile () {
    Fs.unlink(oldFilePath, (error) => {
        if (error) {
            _utils.notification(
                'info',
                'Could not find old file!'
            );
            return;
        }
        _utils.notification(
            'success',
            '<strong>Successfully</strong> deleted old data file!'
        );
    });
}

module.exports = {
    deleteOldFile: deleteOldFile,
    readData: readData,
    buildData: buildData,
    info: info,
    views: views,
    mapper: mapper,
    storage: storage,
    store: store,
    setStorage: setStorage,
    getStorage: getStorage,
    getConfig: getConfig
};
