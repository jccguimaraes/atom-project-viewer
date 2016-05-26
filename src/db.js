'use strict';

const Fs = require('fs');
const Path = require('path');
const _utils = require('./utils');
const pkg = 'project-viewer';
const file = `${pkg}.json`;
const oldFile = `${pkg}.json`;
// const storage = require('./file.json');
let storage;
const mapper = new WeakMap();
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
                    message: `Previous data file not found!<br>Please go to <code>Settings -> Packages -> Project-Viewer ->convertOldData</code> and set to <code>false</code>.`,
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
                    return;
                }

                const converted = {
                    clients: [],
                    groups: [],
                    projects: []
                };

                if (content.hasOwnProperty('groups')) {
                    content.groups.forEach((storedGroup) => {
                        const group = {
                            'name': storedGroup.name || '',
                            'icon': storedGroup.icon || '',
                            'expanded': storedGroup.expanded || '',
                            'sortBy': 'position',
                            'projects': []
                        }
                        converted.groups.push(group);

                        if (content.hasOwnProperty('projects')) {
                            content.projects.forEach((storedProject) => {
                                if (storedProject.group !== group.name) {
                                    return;
                                }
                                const project = {
                                    'name': storedProject.name || '',
                                    'icon': '',
                                    'paths': Object.keys(storedProject.paths) || []
                                }
                                group.projects.push(project);
                            });
                        }
                    });
                }
                storage = converted;
                atom.getStorageFolder().storeSync(file, storage);
                resolve({
                    type: 'success',
                    message: `<strong>Successfully</strong> converted old data to the new data schema!<br>Please go to <code>Settings -> Packages -> Project-Viewer ->convertOldData</code> and set to <code>false</code>.`,
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
    let data = {
        clients: [],
        groups: [],
        projects: []
    };
    let views = document.querySelectorAll('project-viewer li');
    let currentClient;
    let currentGroup;

    for (var idx = 0; idx < views.length; idx++) {
        let model = mapper.get(views[idx]);

        if (model.clientName && model.type === 'client') {
            let client = {
                name: _utils.sanitizeString(model.clientName),
                icon: _utils.sanitizeString(model.clientIcon) || '',
                expanded: model.clientExpanded || false,
                sortBy: model.sortBy || 'position',
                groups: [],
                projects: []
            };
            data.clients.push(client);
            currentClient = client;
        } else if (model.groupName && model.type === 'group') {
            let group = {
                name: _utils.sanitizeString(model.groupName),
                icon: _utils.sanitizeString(model.groupIcon) || '',
                expanded: model.groupExpanded || false,
                sortBy: model.sortBy || 'position',
                projects: []
            };
            if (model.clientName && currentClient && currentClient.name === model.clientName) {
                currentClient.groups.push(group);
            } else {
                data.groups.push(group);
            }
            currentGroup = group;
        } else if (model.projectName && model.type === 'project') {
            let project = {
                name: _utils.sanitizeString(model.projectName),
                icon: _utils.sanitizeString(model.projectIcon) || '',
                paths: model.projectPaths || []
            };
            if (model.groupName && currentGroup && currentGroup.name === model.groupName) {
                currentGroup.projects.push(project);
            } else if (model.clientName && currentClient && currentClient.name === model.clientName) {
                currentClient.projects.push(project);
            } else {
                data.projects.push(project);
            }
        }
    }
    return data;
}

const store = function store() {
    let data = buildData();
    atom.getStorageFolder().storeSync(file, data);
    return data;
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
    mapper: mapper,
    storage: storage,
    store: store,
    setStorage: setStorage,
    getStorage: getStorage,
    getConfig: getConfig
};
