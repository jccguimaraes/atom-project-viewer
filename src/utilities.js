'use strict';

const Notification = require('atom').Notification;

const _caches = require('./caches');
const _db = require('./db');
const _utils = require('./utils');

const _component = require('./component');

const utilities = {
    registerComponent: function registerComponent(component) {
        return _component.register(component.definition, component.methods);
    },
    getConstructor: function getConstructor(definition) {
        return _component.getConstructor(definition);
    },
    fetchProjects: function fetchProjects () {
        const projectViews = document.querySelectorAll('li[is="pv-list-item"]');
        const projectsArray = Array.apply(null, projectViews);
        return projectsArray.map(
            (projectView) => {
                return this.getDB().mapper.get(projectView);
            }
        );
    },
    updateItem: function updateItem(item, changes) {
        const promise = new Promise((resolve, reject) => {
            let currentName = _utils.sanitizeString(item.projectName || item.groupName || item.clientName);
            let newParent;
            let currentView = document.getElementById(currentName);

            if (item.group) {
                newParent = document.getElementById(item.group.name);
            }
            else if (item.client) {
                newParent = document.getElementById(item.client.name);
            }

            if (!changes || !changes.name || typeof changes.name !== 'string') {
                reject({
                    type: 'warning',
                    message: `Please give a new proper name for <strong>${currentName}</strong>!`
                });
                return;
            }

            let currentModel = this.getDB().mapper.get(currentView);

            if (newParent) {
                newParent.addChild(currentView, false, true);
                let parentModel = this.getDB().mapper.get(newParent);
                Object.setPrototypeOf(currentModel, parentModel);
            } else {
                document.querySelector('project-viewer ul[is="pv-list-tree"]').addNode(currentView);
            }

            if (changes.name) {
                currentView.setText(changes.name);
                currentView.setId(changes.name);
            }

            if (changes.name && currentModel.type === 'client') {
                currentModel.clientName = _utils.sanitizeString(changes.name);
            }
            else if (changes.name && currentModel.type === 'group') {
                currentModel.groupName = _utils.sanitizeString(changes.name);
            }
            else if (changes.name && currentModel.type === 'project') {
                currentModel.projectName = _utils.sanitizeString(changes.name);
            }

            if (currentModel.clientIcon && currentModel.type === 'client') {
                currentView.setIcon(_utils.sanitizeString(currentModel.clientIcon), true);
            }
            else if (currentModel.groupIcon && currentModel.type === 'group') {
                currentView.setIcon(_utils.sanitizeString(currentModel.groupIcon), true);
            }
            else if (currentModel.projectIcon && currentModel.type === 'project') {
                currentView.setIcon(_utils.sanitizeString(currentModel.projectIcon), true);
            }

            this.getDB().storage = this.getDB().store();

            resolve({
                type: 'success',
                message: `Updates to <strong>${currentName}</strong> where applied!`
            });
        });
        return promise;
    },
    createItem: function createItem(candidate) {
        const promise = new Promise((resolve, reject) => {
            let safeItem = false;

            if (!candidate || !candidate.type) {
                reject({
                    type: 'warning',
                    message: 'Please select a type to create'
                });
                return;
            }

            if (!candidate || !candidate.name || typeof candidate.name !== 'string') {
                reject({
                    type: 'warning',
                    message: 'Please define a name for the <strong>' + candidate.type + '</strong>'
                });
                return;
            }

            let innerPromise;

            switch (candidate.type) {
                case 'client':
                    innerPromise = this.createClient(candidate);
                break;
                case 'group':
                    innerPromise = this.createGroup(candidate);
                break;
                case 'project':
                    innerPromise = this.createProject(candidate);
                break;
                default:
            }

            innerPromise.then((data) => {
                this.getDB().storage = this.getDB().store();
                resolve(data);
            })
            .catch(reject);
        });
        return promise;
    },
    createClient: function createClient(candidate) {
        const promise = new Promise((resolve, reject) => {

            // TODO change this to just createItem maybe
            if (!candidate || !candidate.name) {
                reject({
                    type: 'warning',
                    message: 'Client has no name defined'
                });
                return;
            }

            let hasIt = false;

            if (this.getDB().storage.clients) {
                hasIt = this.getDB().storage.clients.some(
                    (clientStored) => {
                        return clientStored.name === candidate.name;
                    }
                );
            }

            if (hasIt) {
                reject({
                    type: 'info',
                    message: 'Client <strong>' + candidate.name + '</strong> already exists!'
                });
                return;
            }

            candidate.view.setText(candidate.name);
            candidate.view.setIcon(candidate.icon);
            candidate.view.setId(candidate.name);

            let clientModel = {
                type: candidate.type,
                sortBy: candidate.sortBy,
                clientName: candidate.name,
                clientIcon: candidate.icon,
                clientExpanded: candidate.expanded
            };

            this.getDB().mapper.set(candidate.view, clientModel);

            // TODO change hack
            document.querySelector('project-viewer .list-tree.has-collapsable-children').addNode(candidate.view);

            resolve({
                type: 'success',
                message: `${candidate.type} <strong>${candidate.name}</strong> was created`
            });
        });
        return promise;
    },
    createGroup: function createGroup(candidate) {
        const promise = new Promise((resolve, reject) => {

            let client;
            let groups;

            // TODO change this to just createItem maybe
            if (!candidate || !candidate.name) {
                reject({
                    type: 'warning',
                    message: 'Group has no name defined'
                });
            }

            if (candidate.client) {
                client = this.getDB().storage.clients.filter((clientStored) => {
                    return clientStored.name === candidate.client.name;
                })[0];
                groups = client.groups;
            } else {
                groups = this.getDB().storage.groups;
            }

            let hasIt = false;

            if (groups) {
                hasIt = groups.some(
                    (groupStored) => {
                        return groupStored.name === candidate.name;
                    }
                );
            }

            if (hasIt) {
                reject({
                    type: 'info',
                    message: 'Group <strong>' + candidate.name + '</strong> already exists!'
                });
            }

            candidate.view.setText(candidate.name);
            candidate.view.setIcon(candidate.icon);
            candidate.view.setId(candidate.name);

            let clientModel = {};
            let groupModel = {
                type: candidate.type,
                sortBy: candidate.sortBy,
                groupName: candidate.name,
                groupIcon: candidate.icon,
                groupExpanded: candidate.expanded
            };

            this.getDB().mapper.set(candidate.view, groupModel);

            if (candidate.client) {
                let clientView = document.getElementById(client.name);
                clientModel = this.getDB().mapper.get(clientView);
                Object.setPrototypeOf(groupModel, clientModel);
                clientView.addChild(candidate.view);
            } else {
                // TODO change hack
                document.querySelector('project-viewer .list-tree.has-collapsable-children').addNode(candidate.view);
            }

            resolve({
                type: 'success',
                message: `${candidate.type} <strong>${candidate.name}</strong> was created`
            });
        });
        return promise;
    },
    createProject: function createProject(candidate) {
        const promise = new Promise((resolve, reject) => {

            let client;
            let group;
            let projects;

            // TODO change this to just createItem maybe
            if (!candidate || !candidate.name) {
                reject({
                    type: 'warning',
                    message: 'Project has no name defined'
                });
            }

            if (candidate.client) {
                client = this.getDB().storage.clients.filter((clientStored) => {
                    return clientStored.name === candidate.client.name;
                })[0];
                projects = client.projects;
            }

            if (candidate.group) {
                let context = client || this.getDB().storage;
                group = context.groups.filter((groupStored) => {
                    return groupStored.name === candidate.group.name;
                })[0];
                projects = group.projects;
            }

            if (!candidate.client && !candidate.group) {
                projects = this.getDB().storage.projects;
            }

            let hasIt = false;

            if (projects) {
                 hasIt = projects.some(
                     (projectStored) => {
                         return projectStored.name === candidate.name;
                     }
                 );
            }

            if (hasIt) {
                reject({
                    type: 'info',
                    message: 'Project <strong>' + candidate.name + '</strong> already exists!'
                });
            }

            candidate.view.setText(candidate.name);
            candidate.view.setIcon(candidate.icon);
            candidate.view.setId(candidate.name);

            let clientModel = {};
            let groupModel = {};
            let projectModel = {
                type: candidate.type,
                projectName: candidate.name,
                projectIcon: candidate.icon,
                projectPaths: candidate.paths
            };

            this.getDB().mapper.set(candidate.view, projectModel);

            if (candidate.group) {
                let groupView = document.getElementById(group.name);
                groupModel = this.getDB().mapper.get(groupView);
                Object.setPrototypeOf(projectModel, groupModel);
                groupView.addChild(candidate.view);
            } else if (candidate.client) {
                let clientView = document.getElementById(client.name);
                clientModel = this.getDB().mapper.get(clientView);
                Object.setPrototypeOf(projectModel, clientModel);
                clientView.addChild(candidate.view);
            } else {
                // TODO change hack
                document.querySelector('project-viewer .list-tree.has-collapsable-children').addNode(candidate.view);
            }

            resolve({
                type: 'success',
                message: `${candidate.type} <strong>${candidate.name}</strong> was created`
            });
        });
        return promise;
    },
    getConfig: function getConfig(config) {
        return _db.info.name.concat('.', config);
    },
    setSelectedProjectView: function setSelectedProjectView(view) {
        if (!view) {
            return;
        }
        _caches.selectedProjectView = view;
        this.updateStatusBar();
    },
    getSelectedProjectView: function getSelectedProjectView() {
        let view = _caches.selectedProjectView;
        if (!view) {
            view = document.querySelector('project-viewer .active');
            _caches.selectedProjectView = view;
        }
        return view;
    },
    getSelectedProjectModel: function getSelectedProjectModel() {
        let selected = this.getSelectedProjectView();
        let model;

        if (selected) {
            model = _db.mapper.get(selected);
        }

        return model;
    },
    clearStatusBar: function clearStatusBar() {
        _caches.statusBar = undefined;
    },
    getStatusBar: function getStatusBar() {
        let view = _caches.statusBar;
        if (!view) {
            view = document.querySelector('pv-status-bar');
            _caches.statusBar = view;
        }
        return view;
    },
    updateStatusBar: function updateStatusBar() {
        let statusBar = this.getStatusBar();
        let model = this.getSelectedProjectModel();
        let context = '';

        if (!statusBar || !model) {
            return;
        }

        if (model.clientName) {
            context += model.clientName + ' / ';
        }

        if (model.groupName) {
            context += model.groupName + ' / ';
        }

        if (model.projectName) {
            context += model.projectName;
        } else {
            context = 'No selected project';
        }

        statusBar.setText(context);
    },
    setStatusBarText: function setStatusBarText(text) {
        let statusBar = this.getStatusBar();

        if (statusBar && typeof text === 'string') {
            statusBar.setText(text);
        }
    },
    getDB: function getDB() {
        return _db;
    }
};

module.exports = utilities;
