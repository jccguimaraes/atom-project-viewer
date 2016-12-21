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
        return _db.views.projects.map(
            (projectId) => {
                return _db.mapper.get(
                    document.getElementById(projectId)
                );
            }
        ).filter(
            (project) => {
                if (!project) {
                    return false;
                }
                return true;
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
    removeItem: function removeItem(original) {
        const promise = new Promise((resolve, reject) => {
            this.getDB().store();
            let currentName = original[original.type + 'Name'];

            const idx = this.getDB().views[original.type + 's'].indexOf(original[original.type + 'Id']);
            let view;
            if (idx !== -1) {
                this.getDB().views[original.type + 's'].splice(idx, 1);
                view = document.getElementById(original[original.type + 'Id']);
            }

            if (view) {
                view.remove();
            }

            this.getDB().store();

            this.updateStatusBar();

            resolve({
                type: 'success',
                message: `Removed <em>${original.type}</em> called <strong>${currentName}</strong>!`
            });
        });
        return promise;
    },
    updateItem: function updateItem(original, changes) {
        const promise = new Promise((resolve, reject) => {
            let isANewParent;
            let currentName = original.current[original.current.type + 'Name'];
            let activeModel = this.getSelectedProjectModel();
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
            else {
                original.current[original.current.type + 'Icon'] = undefined;
                itemView.setIcon('');
            }

            if (changes.hasColor && original.current.type !== 'project') {
                original.current[original.current.type + 'Color'] = changes.color;
                itemView.setColor(changes.color);
            }
            else if (changes.hasOwnProperty('hasColor') && !changes.hasColor && original.current.type !== 'project') {
                original.current[original.current.type + 'Color'] = undefined;
                itemView.setColor();
            }
            if (changes.hasOwnProperty('hasDev') && original.current.type === 'project') {
              original.current[original.current.type + 'Dev'] = changes.hasDev;
              // atom.devMode = changes.hasDev;
            }

            if (changes.sortBy) {
                original.current.sortBy = changes.sortBy;
                itemView.sortChildren();
            }

            if (changes.paths) {
                changes.paths.remove.forEach(
                    (path) => {
                        const pathIdx = original.current.projectPaths.indexOf(path);
                        if (pathIdx !== -1) {
                            original.current.projectPaths.splice(pathIdx, 1);
                        }
                        if (pathIdx !== -1 && activeModel && activeModel.projectId === original.current.projectId) {
                            atom.project.removePath(path);
                        }
                    }
                );
                changes.paths.add.forEach(
                    (path) => {
                        if ( path !== undefined ) {
                            original.current.projectPaths.push(path);
                            atom.project.addPath(path);
                        }
                    }
                );
                itemView.validate();
            }

            if (changes.hasGroup) {
                Object.setPrototypeOf(original.current, changes.group);
                isANewParent = document.getElementById(changes.group.groupId);
            }
            else if (changes.hasClient) {
                Object.setPrototypeOf(original.current, changes.client);
                isANewParent = document.getElementById(changes.client.clientId);
            }
            else if (!changes.hasGroup && !original.parent && !original.root) {
                Object.setPrototypeOf(original.current, Object.prototype);
                isANewParent = document.querySelector('ul[is="pv-list-tree"].list-tree.has-collapsable-children');
            }
            else if (
                changes.hasOwnProperty('hasClient') &&
                changes.hasOwnProperty('hasGroup') &&
                !changes.hasClient && !changes.hasGroup
            ) {
              isANewParent = document.querySelector('ul[is="pv-list-tree"].list-tree.has-collapsable-children');
            }

            if (isANewParent) {
                isANewParent.addChild(itemView, true, true);
            }

            this.getDB().store();

            this.updateStatusBar();

            resolve({
                type: 'success',
                message: `Updates to <strong>${currentName}</strong> were applied!`
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

            this.getDB().mapper.set(changes.view, original.current);

            original.current[original.current.type + 'Id'] = _gateway.helpers.generateUUID();
            changes.view.setId(original.current[original.current.type + 'Id']);
            original.current[original.current.type + 'Name'] = changes.name;
            changes.view.setText(original.current[original.current.type + 'Name']);
            original.current[original.current.type + 'Icon'] = changes.icon || '';
            changes.view.setIcon(original.current[original.current.type + 'Icon']);

            if (original.current.type !== 'project') {
                original.current.sortBy = changes.sortBy || 'position';
                original.current[original.current.type + 'Expanded'] = false;
                changes.view.setExpanded(false);
            } else {
                original.current[original.current.type + 'Paths'] = changes.paths || [];
                original.current[original.current.type + 'Dev'] = changes.hasDev || false;
            }

            if (changes.color && original.current.type !== 'project') {
                original.current[original.current.type + 'Color'] = changes.color;
                changes.view.setColor(changes.color);
            }
            else if (!changes.color && original.current.type !== 'project') {
                original.current[original.current.type + 'Color'] = undefined;
                changes.view.setColor();
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

            this.getDB().views[original.current.type + 's'].push(original.current[original.current.type + 'Id']);
            this.getDB().store();

            resolve({
                type: 'success',
                message: `${original.current.type} <strong>${newName}</strong> was created`
            });
        });
        return promise;
    },
    getConfig: function getConfig(config) {
        return _db.info.name.concat('.', config);
    },
    setSelectedProjectView: function setSelectedProjectView(view) {
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

        if (selected) {
            return _db.mapper.get(selected);
        }
        return undefined;
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

        if (!statusBar) {
            return;
        }

        if (!model) {
            context = 'No project selected';
            statusBar.setText(context);
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
            context = 'No project selected';
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
