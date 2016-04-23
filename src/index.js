'use strict';

const CompositeDisposable = require('atom').CompositeDisposable;

const _utility = require('./utilities');
const _config = require('./config');

const _mainComponent = require('./main-component');
const _statusBarComponent = require('./status-bar-component');
const _headerComponent = require('./header-component');
const _listTreeComponent = require('./list-tree-component');
const _listNestedItemComponent = require('./list-nested-item-component');
const _listItemComponent = require('./list-item-component');
const _modalComponent = require('./modal-component');

const _mainConstructor = _utility.registerComponent(_mainComponent);
const _statusBarConstructor = _utility.registerComponent(_statusBarComponent);
const _headerConstructor = _utility.registerComponent(_headerComponent);
const _listTreeConstructor = _utility.registerComponent(_listTreeComponent);
const _listNestedItemConstructor = _utility.registerComponent(_listNestedItemComponent);
const _listItemConstructor = _utility.registerComponent(_listItemComponent);
const _modalConstructor = _utility.registerComponent(_modalComponent);

function createListItem(candidate) {
    let view = new _listItemConstructor();

    if (!candidate) {
        return view;
    }

    view.setText(candidate.name);
    view.setIcon(candidate.icon);
    view.setId(candidate.name);

    return view;
}

function createProject(candidate) {
    let view = createListItem(candidate);
    return view;
};

function createGroup() {
    let view = createListItem(candidate);
    return view;
}

function createClient() {
    let view = createListItem(candidate);
    return view;
}

function addProjects(mappedGroup, groupView, root) {
    let projectsView;
    if (!root) {
        projectsView = new _listTreeConstructor();
        groupView.addNode(projectsView);
    }

    mappedGroup.projects.forEach(
        (mappedProject) => {
            let projectView = createProject(mappedProject);

            let isActive = false;
            if (atom.project.getPaths().length > 0 && Array.isArray(mappedProject.paths) && mappedProject.paths.length > 0) {
                isActive = atom.project.getPaths().every((path) => {
                    return mappedProject.paths.indexOf(path) !== -1;
                });
            }
            if (isActive) {
                projectView.classList.add('active', 'selected');
            }

            if (!root) {
                projectsView.addNode(projectView);
            } else {
                groupView.addNode(projectView);
            }

            let projectModel = {
                type: 'project',
                projectName: mappedProject.name,
                projectIcon: mappedProject.icon || 'icon',
                projectActive: mappedProject.active || false,
                projectPaths: mappedProject.paths || []
            };

            let model = _utility.getDB().mapper.get(groupView);

            if (model) {
                Object.setPrototypeOf(projectModel, model);
            }

            _utility.getDB().mapper.set(projectView, projectModel);
        }
    );

    if (typeof groupView.sortChildren === 'function') {
        groupView.sortChildren();
    }
}

function addGroups(mappedClient, clientView, root) {
    let groupsView;
    if (!root) {
        groupsView = new _listTreeConstructor();
        clientView.addNode(groupsView);
    }

    mappedClient.groups.forEach(
        (mappedGroup) => {
            let groupView = new _listNestedItemConstructor();
            groupView.setText(mappedGroup.name);
            groupView.setIcon(mappedGroup.icon);
            groupView.setId(mappedGroup.name);
            if (!root) {
                groupsView.addNode(groupView);
            } else {
                clientView.addNode(groupView);
            }

            let groupModel = {
                type: 'group',
                sortBy: mappedGroup.sortBy,
                groupName: mappedGroup.name,
                groupIcon: mappedGroup.icon,
                groupExpanded: mappedGroup.expanded
            };

            let clientModel = _utility.getDB().mapper.get(clientView);

            if (clientModel) {
                Object.setPrototypeOf(groupModel, clientModel);
            }

            _utility.getDB().mapper.set(groupView, groupModel);

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

            _utility.getDB().mapper.set(clientView, clientModel);

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

function removeFromStatusBar() {
    _utility.clearStatusBar();
    this.statusBarTile.destroy();
}

function addToStatusBar() {
    let view;
    let selected;
    let selectedModel;
    let context = '';

    view = new _statusBarConstructor();

    this.statusBarTile = this.statusBar.addRightTile({
        item: view,
        priority: 0
    });

    _utility.updateStatusBar();
}

function addModalAddClient () {
    atom.workspace.addModalPanel({
        item: new _modalConstructor(),
        visible: true
    });
}

const projectViewer = {
    config: _config,
    activate: function activate(state) {
        this.disposables = new CompositeDisposable();

        if (state) {
            // TODO
        }

        this.disposables.add(
            atom.commands.add('atom-workspace', {
                'project-viewer2:add-client': addModalAddClient
            }
        ));

        let mainView = new _mainConstructor();
        let headerView = new _headerConstructor();
        let containerView = new _listTreeConstructor();

        containerView.setAsRootLevel();
        mainView.addNode(headerView);
        mainView.addNode(containerView);

        if (_utility.getDB().storage && _utility.getDB().storage.hasOwnProperty('clients') && Array.isArray(_utility.getDB().storage.clients)) {
            addClients(_utility.getDB().storage, containerView);
        } else {
            let listTreeView = new _listTreeConstructor();
            containerView.addNode(listTreeView, true);
        }

        if (_utility.getDB().storage && _utility.getDB().storage.hasOwnProperty('groups') && Array.isArray(_utility.getDB().storage.groups)) {
            addGroups(_utility.getDB().storage, containerView, true);
        } else {
            let listTreeView = new _listTreeConstructor();
            containerView.addNode(listTreeView);
        }

        if (_utility.getDB().storage && _utility.getDB().storage.hasOwnProperty('projects') && Array.isArray(_utility.getDB().storage.projects)) {
            addProjects(_utility.getDB().storage, containerView, true);
        } else {
            let listTreeView = new _listTreeConstructor();
            containerView.addNode(listTreeView);
        }

        this.panel = atom.workspace.addRightPanel({
            item: mainView,
            visible: atom.config.get(_utility.getConfig('startupVisibility'))
        });

        atom.config.observe(_utility.getConfig('autohide'), (value) => {
            if (value) {
                this.panel.getItem().classList.add('autohide');
            } else {
                this.panel.getItem().classList.remove('autohide');
            }
        });

        atom.config.observe(_utility.getConfig('hideHeader'), (value) => {
            if (value) {
                headerView.classList.add('autohide');
            } else {
                headerView.classList.remove('autohide');
            }
        });

        atom.config.onDidChange('project-viewer2.statusBarVisibility', (status) => {
            if (status.newValue) {
                addToStatusBar.call(this);
            } else {
                removeFromStatusBar.call(this);
            }
        });
    },
    deactivate: function deactivate() {},
    serialize: function serialize() {},
    deactivate: function deactivate() {
        this.panel.destroy();
        this.statusBarTile.destroy();
    },
    consumeStatusBar: function consumeStatusBar(statusBar) {
        this.statusBar = statusBar;

        if (atom.config.get(_utility.getConfig('startupVisibility')) && atom.config.get(_utility.getConfig('statusBarVisibility'))) {
            addToStatusBar.call(this);
        }
    },
};

module.exports = projectViewer;
