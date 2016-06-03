'use strict';

const Notification = require('atom').Notification;

const _caches = require('./caches');
const _db = require('./db');
const _utils = require('./utils');
const _gateway = require('./gateway');

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
    getItemChain: function f_getItemChain (item) {
        let parentPrototype;
        let parentProto;
        let rootPrototype;
        let chain = {};

        if (item && Object.keys(item).length > 0) {
            chain.current = item;
        }

        if (Object.getPrototypeOf(item) === Object.prototype) {
            parentPrototype = undefined;
        } else {
            parentPrototype = Object.getPrototypeOf(item);
            parentProto = Object.getPrototypeOf(parentPrototype);
            chain.parent = parentPrototype;
        }

        if (parentProto === Object.prototype) {
            rootPrototype = undefined;
        } else if (parentProto) {
            rootPrototype = parentProto;
            chain.root = rootPrototype;
        }

        return chain;
    },
    updateItem: function updateItem(original, changes) {
        const promise = new Promise((resolve, reject) => {
            let isANewParent;
            let currentName = original.current[original.current.type + 'Name'];
            const itemView = document.getElementById(original.current[original.current.type + 'Id']);

            if (changes.name) {
                const newName = _utils.sanitizeString(changes.name);
                original.current[original.current.type + 'Name'] = newName;
                itemView.setText(newName);
            }

            if (changes.icon) {
                original.current[original.current.type + 'Icon'] = changes.icon;
                itemView.setIcon(changes.icon, true);
            }

            if (changes.hasGroup) {
                Object.setPrototypeOf(original.current, changes.group);
                isANewParent = document.getElementById(changes.group.groupId);
            } else if (changes.hasClient) {
                Object.setPrototypeOf(original.current, changes.client);
                isANewParent = document.getElementById(changes.client.clientId);
            } else if (!changes.hasGroup && !original.parent && !original.root) {
                Object.setPrototypeOf(original.current, Object.prototype);
                isANewParent = document.querySelector('ul[is="pv-list-tree"].list-tree.has-collapsable-children')
            }

            if (isANewParent) {

                isANewParent.addChild(itemView, true, true);
            }

            this.getDB().store();

            resolve({
                type: 'success',
                message: `Updates to <strong>${currentName}</strong> where applied!`
            });
        });
        return promise;
    },
    createItem: function createItem(original, changes) {
        const promise = new Promise((resolve, reject) => {
            if (!original.current || !changes) {
                reject({
                    type: 'warning',
                    message: 'Please provide the minimum parameters to create a new item'
                });
            }

            if (!original.current.type) {
                reject({
                    type: 'warning',
                    message: 'Please select a type to create'
                });
            }

            if (!changes.name) {
                reject({
                    type: 'warning',
                    message: 'Please define a valid name for the <strong>' + changes.type + '</strong>'
                });
                return;
            }

            const newName = _utils.sanitizeString(changes.name);

            let model = {
                type: original.current.type
            };

            model.sortBy = changes.sortBy;
            model[model.type + 'Id'] = _gateway.helpers.generateUUID();
            model[model.type + 'Name'] = changes.name;
            model[model.type + 'Icon'] = changes.icon;

            if (model.type !== 'project') {
                model[model.type + 'Expanded'] = false;
            } else {
                model[model.type + 'Paths'] = [];
            }

            console.debug(model);

            reject({
                type: 'warning',
                message: 'cenas'
            });

            // let safeItem = false;
            //
            // if (!candidate || !candidate.type) {
            //     reject({
            //         type: 'warning',
            //         message: 'Please select a type to create'
            //     });
            //     return;
            // }
            //
            // if (!candidate || !candidate.name || typeof candidate.name !== 'string') {
            //     reject({
            //         type: 'warning',
            //         message: 'Please define a name for the <strong>' + candidate.type + '</strong>'
            //     });
            //     return;
            // }
            //
            // let innerPromise;
            //
            // switch (candidate.type) {
            //     case 'client':
            //         innerPromise = this.createClient(candidate);
            //     break;
            //     case 'group':
            //         innerPromise = this.createGroup(candidate);
            //     break;
            //     case 'project':
            //         innerPromise = this.createProject(candidate);
            //     break;
            //     default:
            // }
            //
            // innerPromise.then((data) => {
            //     this.getDB().storage = this.getDB().store();
            //     if (data.id) {
            //         this.views[candidate.type + 's'].push(data.id);
            //         console.debug(this.views);
            //     }
            //     resolve(data);
            // })
            // .catch(reject);
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

            let clientModel = {
                type: candidate.type,
                sortBy: candidate.sortBy,
                clientName: candidate.name,
                clientIcon: candidate.icon,
                clientExpanded: candidate.expanded,
                clientId: _gateway.helpers.generateUUID()
            };

            this.getDB().mapper.set(candidate.view, clientModel);
            candidate.view.setId();

            // TODO change hack
            document.querySelector('project-viewer .list-tree.has-collapsable-children').addNode(candidate.view);

            resolve({
                type: 'success',
                message: `${candidate.type} <strong>${candidate.name}</strong> was created`,
                id: clientModel.clientId
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

            let clientModel = {};
            let groupModel = {
                type: candidate.type,
                sortBy: candidate.sortBy,
                groupName: candidate.name,
                groupIcon: candidate.icon,
                groupExpanded: candidate.expanded,
                groupId: _gateway.helpers.generateUUID()
            };

            this.getDB().mapper.set(candidate.view, groupModel);
            candidate.view.setId();

            if (candidate.client) {
                let clientView = document.getElementById(client.clientId);
                clientModel = this.getDB().mapper.get(clientView);
                Object.setPrototypeOf(groupModel, clientModel);
                clientView.addChild(candidate.view);
            } else {
                // TODO change hack
                document.querySelector('project-viewer .list-tree.has-collapsable-children').addNode(candidate.view);
            }

            resolve({
                type: 'success',
                message: `${candidate.type} <strong>${candidate.name}</strong> was created`,
                id: groupModel.groupId
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

            let clientModel = {};
            let groupModel = {};
            let projectModel = {
                type: candidate.type,
                projectName: candidate.name,
                projectIcon: candidate.icon,
                projectPaths: candidate.paths,
                projectId: _gateway.helpers.generateUUID()
            };

            this.getDB().mapper.set(candidate.view, projectModel);
            candidate.view.setId();

            if (candidate.group) {
                let groupView = document.getElementById(group.groupId);
                groupModel = this.getDB().mapper.get(groupView);
                Object.setPrototypeOf(projectModel, groupModel);
                groupView.addChild(candidate.view);
            } else if (candidate.client) {
                let clientView = document.getElementById(client.clientId);
                clientModel = this.getDB().mapper.get(clientView);
                Object.setPrototypeOf(projectModel, clientModel);
                clientView.addChild(candidate.view);
            } else {
                // TODO change hack
                document.querySelector('project-viewer .list-tree.has-collapsable-children').addNode(candidate.view);
            }

            resolve({
                type: 'success',
                message: `${candidate.type} <strong>${candidate.name}</strong> was created`,
                id: projectModel.projectId
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
