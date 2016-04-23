'use strict';

const _utils = require('./utils');
const pkg = 'project-viewer2';
const file = 'project-viewer2.json';
// const storage = require('./file.json');
const storage = atom.getStorageFolder().load(file) || {};
const mapper = new WeakMap();

const info = {
    version: '0.3.0',
    name: 'project-viewer2'
};

const getConfig = function getConfig(config) {
    return pkg.concat('.', config);
};

const store = function store() {
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
                name: model.clientName,
                icon: model.clientIcon || '',
                expanded: model.clientExpanded || false,
                sortBy: model.sortBy || 'position',
                groups: [],
                projects: []
            };
            data.clients.push(client);
            currentClient = client;
        } else if (model.groupName && model.type === 'group') {
            let group = {
                name: model.groupName,
                icon: model.groupIcon || '',
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
                name: model.projectName,
                paths: model.projectPaths || [],
                active: model.projectActive || false
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
    atom.getStorageFolder().storeSync(file, data);
};

module.exports = {
    info: info,
    mapper: mapper,
    storage: storage,
    store: store,
    getConfig: getConfig
};
