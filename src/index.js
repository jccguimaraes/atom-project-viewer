'use strict';

const CompositeDisposable = require('atom').CompositeDisposable;

const _utils = require('./utils');
const _utility = require('./utilities');
const _config = require('./config');
const githubWorker = new Worker(__dirname + '/github-web-worker.js');
const _selectView = require('./select-view');

const _mainComponent = require('./main-component');
const _statusBarComponent = require('./status-bar-component');
const _headerComponent = require('./header-component');
const _listTreeComponent = require('./list-tree-component');
const _listNestedItemComponent = require('./list-nested-item-component');
const _listItemComponent = require('./list-item-component');
const _modalCreateComponent = require('./modal-create-component');
const _modalUpdateComponent = require('./modal-update-component');
const _modalRemoveComponent = require('./modal-remove-component');
const _modalRemoveQuickComponent = require('./modal-remove-quick-component');

const _mainConstructor = _utility.registerComponent(_mainComponent);
const _statusBarConstructor = _utility.registerComponent(_statusBarComponent);
const _headerConstructor = _utility.registerComponent(_headerComponent);
const _listTreeConstructor = _utility.registerComponent(_listTreeComponent);
const _listNestedItemConstructor = _utility.registerComponent(_listNestedItemComponent);
const _listItemConstructor = _utility.registerComponent(_listItemComponent);
const _modalCreateConstructor = _utility.registerComponent(_modalCreateComponent);
const _modalUpdateConstructor = _utility.registerComponent(_modalUpdateComponent);
const _modalRemoveConstructor = _utility.registerComponent(_modalRemoveComponent);
const _modalRemoveQuickConstructor = _utility.registerComponent(_modalRemoveQuickComponent);

const _views = new WeakMap();

function updateProjectViewer () {
    const views = _views.get(this);

    if (!views.hasOwnProperty('mainView')) {
        _utils.notification('error', 'No main view found! This is bad...');
        return;
    }

    views.containerView.setAsRootLevel();
    views.mainView.addNode(views.headerView);
    views.mainView.addNode(views.containerView);

    if (_utility.getDB().storage && _utility.getDB().storage.hasOwnProperty('clients') && Array.isArray(_utility.getDB().storage.clients)) {
        addClients(_utility.getDB().storage, views.containerView);
    } else {
        let listTreeView = new _listTreeConstructor();
        views.containerView.addNode(listTreeView, true);
    }

    if (_utility.getDB().storage && _utility.getDB().storage.hasOwnProperty('groups') && Array.isArray(_utility.getDB().storage.groups)) {
        addGroups(_utility.getDB().storage, views.containerView, true);
    } else {
        let listTreeView = new _listTreeConstructor();
        views.containerView.addNode(listTreeView);
    }

    if (_utility.getDB().storage && _utility.getDB().storage.hasOwnProperty('projects') && Array.isArray(_utility.getDB().storage.projects)) {
        addProjects(_utility.getDB().storage, views.containerView, true);
    } else {
        let listTreeView = new _listTreeConstructor();
        views.containerView.addNode(listTreeView);
    }
}

function createListItem (candidate) {
    let view = new _listItemConstructor();

    if (!candidate) {
        return view;
    }

    view.setText(candidate.name);
    view.setIcon(candidate.icon);
    view.setId(candidate.name);

    return view;
}

function createProject (candidate) {
    let view = createListItem(candidate);
    return view;
};

function createGroup () {
    let view = createListItem(candidate);
    return view;
}

function createClient () {
    let view = createListItem(candidate);
    return view;
}

function addProjects (parentMapper, parentView, atRootLevel) {
    let projectsView;
    if (!atRootLevel) {
        projectsView = new _listTreeConstructor();
        parentView.addNode(projectsView);
    }

    parentMapper.projects.forEach(
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

            if (!atRootLevel) {
                projectsView.addNode(projectView);
            } else {
                parentView.addNode(projectView);
            }

            let projectModel = {
                type: 'project',
                projectName: mappedProject.name,
                projectIcon: mappedProject.icon || 'icon',
                projectPaths: mappedProject.paths || []
            };

            let model = _utility.getDB().mapper.get(parentView);

            if (model) {
                Object.setPrototypeOf(projectModel, model);
            }

            _utility.getDB().mapper.set(projectView, projectModel);
            projectView.validate();
        }
    );

    if (typeof parentView.sortChildren === 'function') {
        parentView.sortChildren();
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

            groupView.setText(mappedGroup.name);
            groupView.setIcon(mappedGroup.icon);
            groupView.setId(mappedGroup.name);
            groupView.setExpanded(mappedGroup.expanded);
            if (!root) {
                groupsView.addNode(groupView);
            } else {
                clientView.addNode(groupView);
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

            clientView.setText(mappedClient.name);
            clientView.setIcon(mappedClient.icon);
            clientView.setId(mappedClient.name);
            clientView.setExpanded(mappedClient.expanded);
            rootView.addNode(clientView);
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

function githubWorkerOnMessage(event) {
    if (!event.data) {
        _utils.notification('error', 'something\'s wrong with the web worker');
        return;
    }

    if (event.data.value) {
        _utility.getDB().storage = value;
    }

    _utils.notification(event.data.type, event.data.message);
}

function fileBackup () {
    githubWorker.postMessage([
        {
            action: 'update',
            token: atom.config.get(_utility.getConfig('githubToken')),
            value: _utility.getDB().storage
        }
    ]);
}

function fileImport () {
    githubWorker.postMessage([
        {
            action: 'fetch',
            token: atom.config.get(_utility.getConfig('githubToken'))
        }
    ]);
}

function removeQuickModal (evt) {

    const view = new _modalRemoveQuickConstructor();
    const model = {};

    let projectView;
    let groupView;
    let clientView;
    let chosenView;
    let chosenModel;

    if (evt && evt.target) {
        chosenView = evt.target;
        chosenModel = _utility.getDB().mapper.get(chosenView);
    }

    if (chosenModel && chosenModel.type) {
        model.type = chosenModel.type;
    }

    if (chosenModel && chosenModel.type === 'project') {
        projectView = chosenView;
        groupView = document.getElementById(chosenModel.groupName);
        clientView = document.getElementById(chosenModel.clientName);
    }
    else if (chosenModel && chosenModel.type === 'group') {
        groupView = chosenView;
        clientView = document.getElementById(chosenModel.clientName);
    }
    else if (chosenModel && chosenModel.type === 'client') {
        clientView = chosenView;
    }

    if (projectView) {
        model.project = _utility.getDB().mapper.get(projectView);
        model.projectView = projectView;
    }

    if (groupView) {
        model.group = _utility.getDB().mapper.get(groupView);
        model.groupView = groupView;
    }

    if (clientView) {
        model.client = _utility.getDB().mapper.get(clientView);
        model.clientView = clientView;
    }

    _utility.getDB().mapper.set(view, model);

    let modal = atom.workspace.addModalPanel({
        item: view,
        visible: true
    });
}

function removeModal () {

    const view = new _modalRemoveConstructor();
    const model = {};

    _utility.getDB().mapper.set(view, model);

    let modal = atom.workspace.addModalPanel({
        item: view,
        visible: true
    });
}

function updateModal (evt) {

    let model = _utility.getDB().mapper.get(evt.target) || {};

    const view = new _modalUpdateConstructor();

    _utility.getDB().mapper.set(view, model);

    let modal = atom.workspace.addModalPanel({
        item: view,
        visible: true
    });
}

function createModal (evt) {

    console.debug(_utility.getDB().mapper.get(evt.target) || {});

    const model = {};

    const view = new _modalCreateConstructor();

    _utility.getDB().mapper.set(view, model);

    let modal = atom.workspace.addModalPanel({
        item: view,
        visible: true
    });
}

function togglePanel() {
    const views = _views.get(this);
    views.mainPanel.visible ? views.mainPanel.hide() : views.mainPanel.show();
}

function setFocus() {
    const views = _views.get(this);
    views.mainPanel.getItem().focus();
}

function toggleFocus() {
    const views = _views.get(this);
    if (document.activeElement === views.mainPanel.getItem()) {
        atom.workspace.getActivePane().activate();
    } else {
        setFocus.call(this);
    }
}

const projectViewer = {
    config: _config,
    activate: function activate(state) {
        this.disposables = new CompositeDisposable();

        const views = {};

        if (state) {
            // TODO maybe show a CHANGELOG
        }

        views.mainView = new _mainConstructor();
        views.headerView = new _headerConstructor();
        views.containerView = new _listTreeConstructor();

        views.mainPanel = atom.workspace.addRightPanel({
            item: views.mainView,
            visible: atom.config.get(_utility.getConfig('startupVisibility'))
        });

        atom.config.observe(_utility.getConfig('autohide'), (value) => {
            if (value) {
                views.mainPanel.getItem().classList.add('autohide');
            } else {
                views.mainPanel.getItem().classList.remove('autohide');
            }
        });

        atom.config.observe(_utility.getConfig('hideHeader'), (value) => {
            if (value) {
                views.headerView.classList.add('autohide');
            } else {
                views.headerView.classList.remove('autohide');
            }
        });

        atom.config.onDidChange('project-viewer2.statusBarVisibility', (status) => {
            if (status.newValue) {
                addToStatusBar.call(this);
            } else {
                removeFromStatusBar.call(this);
            }
        });

        this.disposables.add(
            atom.commands.add('atom-workspace', {
                'project-viewer2:toggle-display': togglePanel.bind(this),
                'project-viewer2:toggle-focus': toggleFocus.bind(this),
                'project-viewer2:create-item': createModal,
                'project-viewer2:create-client-item': createModal.bind(this),
                'project-viewer2:create-group-item': createModal.bind(this),
                'project-viewer2:create-project-item': createModal.bind(this),
                'project-viewer2:update-item': updateModal,
                'project-viewer2:remove-item': removeModal,
                'project-viewer2:remove-quick-item': removeQuickModal,
                'project-viewer2:file-backup': fileBackup,
                'project-viewer2:file-import': fileImport
            }
        ));

        this.disposables.add(
            atom.contextMenu.add({
                'ul[is="pv-list-tree"]': [
                    {
                        label: 'Create Client',
                        command: "project-viewer2:create-client-item",
                        shouldDisplay: (event) => {
                            const model = _utility.getDB().mapper.get(event.target);
                            return !model;
                        }
                    },
                    {
                        label: 'Create Group',
                        command: "project-viewer2:create-group-item",
                        shouldDisplay: (event) => {

                            const model = _utility.getDB().mapper.get(event.target);
                            if (model && model.type !== 'client') {
                                return false;
                            }
                            return true;
                        }
                    },
                    {
                        label: 'Create Project',
                        command: "project-viewer2:create-project-item",
                        shouldDisplay: (event) => {
                            const model = _utility.getDB().mapper.get(event.target);
                            if (model && model.type === 'project') {
                                return false;
                            }
                            return true;
                        }
                    }
                ]
            })
        );

        _views.set(this, views);

        updateProjectViewer.call(this);

        githubWorker.onmessage = githubWorkerOnMessage;

        views.selectView = new _selectView();
    },
    serialize: function serialize() {},
    deactivate: function deactivate() {
        const views = _views.get(this);

        views.mainPanel.destroy();
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
