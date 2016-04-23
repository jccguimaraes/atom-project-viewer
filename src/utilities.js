'use strict';

const Notification = require('atom').Notification;

const _caches = require('./caches');
const _db = require('./db');

const _component = require('./component');

const utilities = {
    registerComponent: function registerComponent(component) {
        return _component.register(component.definition, component.methods);
    },
    getConstructor: function getConstructor(definition) {
        return _component.getConstructor(definition);
    },
    createClient: function createClient(candidate) {
        const promise = new Promise((resolve, reject) => {
            let safeClient = false;

            if (!candidate || !candidate.name || typeof candidate.name !== 'string') {
                reject({
                    type: 'warning',
                    message: 'Please define a name for the client'
                });
            }

            safeClient = !this.getDB().storage.clients.some(
                (clientStored) => {
                    return clientStored.name === candidate.name;
                }
            );

            if (!safeClient) {
                reject({
                    type: 'info',
                    message: 'Client already exists with that name'
                });
            }

            let clientView = new candidate.viewConstructor();
            clientView.setText(candidate.name);

            let clientModel = {
                type: 'client',
                sortBy: candidate.sortBy,
                clientName: candidate.name,
                clientIcon: candidate.icon,
                clientExpanded: candidate.expanded
            };
            this.getDB().mapper.set(clientView, clientModel);

            console.debug(clientView);

            document.querySelector('project-viewer .list-tree').appendChild(clientView);

            resolve({
                type: 'success',
                message: 'client <strong>' + candidate.name + '</strong> was created'
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
