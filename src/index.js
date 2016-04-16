'use strict';

const CompositeDisposable = require('atom').CompositeDisposable;

const _db = require('./db');
const _config = require('./config');
const _component = require('./component');
const _mainComponent = require('./main-component');
const _headerComponent = require('./header-component');
const _listTreeComponent = require('./list-tree-component');
const _listNestedItemComponent = require('./list-nested-item-component');
const _listItemComponent = require('./list-item-component');

const _mainConstructor = _component.register(
    _mainComponent.component,
    _mainComponent.methods
);

const _headerConstructor = _component.register(
    _headerComponent.component,
    _headerComponent.methods
);

const _listTreeConstructor = _component.register(
    _listTreeComponent.component,
    _listTreeComponent.methods
);

const _listNestedItemConstructor = _component.register(
    _listNestedItemComponent.component,
    _listNestedItemComponent.methods
);

const _listItemConstructor = _component.register(
    _listItemComponent.component,
    _listItemComponent.methods
);

let mainView = new _mainConstructor();
let headerView = new _headerConstructor();
let containerView = new _listTreeConstructor();

containerView.setAsRootLevel();
mainView.addNode(headerView);
mainView.addNode(containerView);

function addProjects(mappedGroup, groupView) {
    let projectsView = new _listTreeConstructor();
    groupView.addNode(projectsView);
    mappedGroup.projects.forEach(
        (mappedProject) => {
            let projectView = new _listItemConstructor();
            projectView.setText(mappedProject.name);
            projectView.setIcon(mappedProject.icon);
            projectView.setId(mappedProject.name);


            let isActive = false;
            if (Array.isArray(mappedProject.paths) && mappedProject.paths.length > 0) {
                isActive = atom.project.getPaths().every((path) => {
                    return mappedProject.paths.indexOf(path) !== -1;
                });
            }
            if (isActive) {
                projectView.classList.add('active');
            }
            projectsView.addNode(projectView);

            let projectModel = {
                type: 'project',
                projectName: mappedProject.name,
                projectIcon: mappedProject.icon || 'icon',
                projectActive: mappedProject.active || false,
                projectPaths: mappedProject.paths || []
            };

            let model = _db.mapper.get(groupView);

            Object.setPrototypeOf(projectModel, model);
            _db.mapper.set(projectView, projectModel);
        }
    );

    if (typeof groupView.sortChildren === 'function') {
        groupView.sortChildren();
    }
}

function addGroups(mappedClient, clientView) {
    let groupsView = new _listTreeConstructor();
    clientView.addNode(groupsView);

    mappedClient.groups.forEach(
        (mappedGroup) => {
            let groupView = new _listNestedItemConstructor();
            groupView.setText(mappedGroup.name);
            groupView.setIcon(mappedGroup.icon);
            groupView.setId(mappedGroup.name);
            groupsView.addNode(groupView);

            let groupModel = {
                type: 'group',
                sortBy: mappedGroup.sortBy,
                groupName: mappedGroup.name,
                groupIcon: mappedGroup.icon,
                groupExpanded: mappedGroup.expanded
            };

            let clientModel = _db.mapper.get(clientView);

            if (clientModel) {
                Object.setPrototypeOf(groupModel, clientModel);
            }

            _db.mapper.set(groupView, groupModel);

            if (mappedGroup.hasOwnProperty('projects') && Array.isArray(mappedGroup.projects)) {
                addProjects(mappedGroup, groupView);
            }
        }
    );

    if (typeof clientView.sortChildren === 'function') {
        clientView.sortChildren();
    }
}

function addClients(mappedRoot, rootView) {
    mappedRoot.clients.forEach(
        (mappedClient) => {
            let clientView = new _listNestedItemConstructor();
            clientView.setText(mappedClient.name);
            clientView.setIcon(mappedClient.icon);
            clientView.setId(mappedClient.name);
            rootView.addNode(clientView);

            let clientModel = {
                type: 'client',
                sortBy: mappedClient.sortBy,
                clientName: mappedClient.name,
                clientIcon: mappedClient.icon,
                clientExpanded: mappedClient.expanded
            };

            _db.mapper.set(clientView, clientModel);

            if (mappedClient.hasOwnProperty('groups') && Array.isArray(mappedClient.groups)) {
                let clientGroupsView = new _listTreeConstructor();
                clientView.addNode(clientGroupsView);

                addGroups(mappedClient, clientView);
            }

            if (mappedClient.hasOwnProperty('projects') && Array.isArray(mappedClient.projects)) {
                addProjects(mappedClient, clientView);
            }
        }
    );

    if (typeof rootView.sortChildren === 'function') {
        rootView.sortChildren();
    }
};

const projectViewer = {
    config: _config,
    activate: function activate(state) {
        this.disposables = new CompositeDisposable();

        if (state) {
            // TODO
        }

        if (_db.storage && _db.storage.hasOwnProperty('clients') && Array.isArray(_db.storage.clients)) {
            addClients(_db.storage, containerView);
        }

        if (_db.storage && _db.storage.hasOwnProperty('groups') && Array.isArray(_db.storage.groups)) {
            addGroups(_db.storage, containerView);
        }

        if (_db.storage && _db.storage.hasOwnProperty('projects') && Array.isArray(_db.storage.projects)) {
            addProjects(_db.storage, containerView);
        }

        this.panel = atom.workspace.addRightPanel({
            item: mainView,
            visible: atom.config.get('project-viewer2.startupVisibility')
        });

        atom.config.observe('project-viewer2.autohide', (value) => {
            if (value) {
                this.panel.getItem().classList.add('autohide');
            } else {
                this.panel.getItem().classList.remove('autohide');
            }
        });
    },
    deactivate: function deactivate() {},
    serialize: function serialize() {},
    deactivate: function deactivate() {
        this.panel.destroy();
    }
};

module.exports = projectViewer;
