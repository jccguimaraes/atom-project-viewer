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

            this.getDB().mapper.set(changes.view, model);

            model[model.type + 'Id'] = _gateway.helpers.generateUUID();
            changes.view.setId(model[model.type + 'Id']);
            model[model.type + 'Name'] = changes.name;
            changes.view.setText(model[model.type + 'Name']);
            model[model.type + 'Icon'] = changes.icon;
            changes.view.setIcon(model[model.type + 'Icon']);

            if (model.type !== 'project') {
                model.sortBy = changes.sortBy || 'position';
                model[model.type + 'Expanded'] = false;
                changes.view.setExpanded(false);
            } else {
                model[model.type + 'Paths'] = changes.paths || [];
            }

            let parentView;

            if (changes.hasGroup) {
                parentView = document.getElementById(changes.group.groupId);
                parentView.addChild(changes.view);
            }
            else if (changes.hasClient) {
                parentView = document.getElementById(changes.client.clientId);
                parentView.addChild(changes.view);
            } else {
                parentView = document.querySelector('project-viewer .list-tree.has-collapsable-children');
                parentView.addNode(changes.view);
            }

            this.getDB().views[model.type + 's'].push(model[model.type + 'Id']);
            this.getDB().setStorage(this.getDB().store());

            resolve({
                type: 'success',
                message: `${model.type} <strong>${newName}</strong> was created`
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