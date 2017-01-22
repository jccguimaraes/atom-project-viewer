'use strict';

const path = require('path');

const CompositeDisposable = require('atom').CompositeDisposable;

const _gateway = require('./gateway');
const _utils = require('./utils');
const _utility = require('./utilities');
const _config = require('./config');
const githubWorker = new Worker(__dirname + '/github-web-worker.js');
const _selectView = require('./select-view');
const _colors = require('./colors');

const _modal = require('./modal');
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

const _modalConstructor = _utility.registerComponent(_modal);
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

let bypass = false;

function elevateToProject () {
    let paths = atom.project.getPaths();

    if (paths.length === 0) {
        _utils.notification(
            'info',
            'There is no paths available...'
        );
        return;
    }

    let model = {
        type: 'project',
        projectPaths: paths,
        projectName: path.basename(paths[0])
    };

    const view = new _modalCreateConstructor();

    _utility.getDB().mapper.set(view, model);

    let modal = atom.workspace.addModalPanel({
        item: view,
        visible: true
    });
}

function updateProjectViewer () {
    const views = _views.get(this);

    if (!views.hasOwnProperty('mainView')) {
        _utils.notification('error', 'No main view found! This is bad...');
        return;
    }

    views.containerView.removeChildren();

    _utility.getDB().readData()
    .then((data) => {
        if (data) {
            _utils.notification(
                data.type,
                data.message,
                data.options
            );
        }
        const storage = _utility.getDB().getStorage();
        if (storage && storage.hasOwnProperty('clients') && Array.isArray(storage.clients)) {
            addClients(storage, views.containerView);
        } else {
            let listTreeView = new _listTreeConstructor();
            views.containerView.addNode(listTreeView, true);
        }

        if (storage && storage.hasOwnProperty('groups') && Array.isArray(storage.groups)) {
            addGroups(undefined, views.containerView, storage.groups, true);
        } else {
            let listTreeView = new _listTreeConstructor();
            views.containerView.addNode(listTreeView);
        }

        if (storage && storage.hasOwnProperty('projects') && Array.isArray(storage.projects)) {
            addProjects(storage, views.containerView, true);
        } else {
            let listTreeView = new _listTreeConstructor();
            views.containerView.addNode(listTreeView);
        }
    })
    .catch((data) => {
        _utils.notification(
            data.type,
            data.message,
            data.options
        );
    });
}

function createListItem (candidate) {
    let view = new _listItemConstructor();

    if (!candidate) {
        return view;
    }

    view.setText(candidate.name);
    view.setIcon(candidate.icon);

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
                isActive = atom.project.getPaths().every((_path) => {
                    return mappedProject.paths.indexOf(_path) !== -1;
                });
            }
            if (isActive) {
              // atom.devMode = mappedProject.dev;
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
                projectIcon: mappedProject.icon || '',
                projectPaths: mappedProject.paths || [],
                projectColor: mappedProject.color || '',
                projectDev: mappedProject.dev || false,
                projectId: _gateway.helpers.generateUUID()
            };

            let model = _utility.getDB().mapper.get(parentView);

            if (model) {
                Object.setPrototypeOf(projectModel, model);
            }

            _utility.getDB().mapper.set(projectView, projectModel);
            projectView.validate();
            projectView.setId();
            _utility.getDB().views.projects.push(projectModel.projectId);
        }
    );

    if (typeof parentView.sortChildren === 'function') {
        parentView.sortChildren();
    }
}

function addGroups(mappedClient, clientView, list, root) {
    let groupsView;
    if (!root) {
        groupsView = new _listTreeConstructor();
        clientView.addNode(groupsView);
    }

    list.forEach(
        (mappedGroup) => {
            let groupView = new _listNestedItemConstructor();

            let groupModel = {
                type: 'group',
                sortBy: mappedGroup.sortBy,
                groupName: mappedGroup.name,
                groupIcon: mappedGroup.icon,
                groupColor: mappedGroup.color || '',
                groupExpanded: mappedGroup.expanded,
                groupId: _gateway.helpers.generateUUID()
            };

            let clientModel = _utility.getDB().mapper.get(clientView);

            if (clientModel) {
                Object.setPrototypeOf(groupModel, clientModel);
            }

            _utility.getDB().mapper.set(groupView, groupModel);

            if (mappedGroup.hasOwnProperty('projects') && Array.isArray(mappedGroup.projects)) {
                addProjects(mappedGroup, groupView);
            }

            groupView.setId();
            groupView.setText(mappedGroup.name);
            groupView.setIcon(mappedGroup.icon);
            groupView.setColor(mappedGroup.color);
            groupView.setExpanded(mappedGroup.expanded);
            _utility.getDB().views.groups.push(groupModel.groupId);
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
                clientColor: mappedClient.color || '',
                clientExpanded: mappedClient.expanded,
                clientId: _gateway.helpers.generateUUID()
            };

            _utility.getDB().mapper.set(clientView, clientModel);

            if (mappedClient.hasOwnProperty('groups') && Array.isArray(mappedClient.groups)) {
                let clientGroupsView = new _listTreeConstructor();
                clientView.addNode(clientGroupsView);
                addGroups(clientModel, clientView, mappedClient.groups);
            }

            if (mappedClient.hasOwnProperty('projects') && Array.isArray(mappedClient.projects)) {
                addProjects(mappedClient, clientView);
            }

            clientView.setId();
            clientView.setText(mappedClient.name);
            clientView.setIcon(mappedClient.icon);
            clientView.setColor(mappedClient.color);
            clientView.setExpanded(mappedClient.expanded);
            _utility.getDB().views.clients.push(clientModel.clientId);
            rootView.addNode(clientView);
        }
    );

    if (typeof rootView.sortChildren === 'function') {
        rootView.sortChildren();
    }
};

function removeFromStatusBar() {
    _utility.clearStatusBar();
    if (this.statusBarTile) {
        this.statusBarTile.destroy();
    }
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
        _utility.getDB().getStorage() = value;
    }

    if (event.data.db) {
        _utility.getDB().setStorage(event.data.db);
        updateProjectViewer.call(this);
    }

    if (event.data.gistId) {
      atom.config.set(_utility.getConfig('gistId'), event.data.gistId);
    }

    _utils.notification(event.data.type, event.data.message, event.data.options);
}

function fileBackup () {
    githubWorker.postMessage([
        {
            action: 'update',
            token: atom.config.get(_utility.getConfig('githubAccessToken')),
            gistId: atom.config.get(_utility.getConfig('gistId')),
            setName: atom.config.get(_utility.getConfig('setName')),
            value: _utility.getDB().getStorage()
        }
    ]);
}

function fileImport () {
    githubWorker.postMessage([
        {
            action: 'fetch',
            token: atom.config.get(_utility.getConfig('githubAccessToken')),
            gistId: atom.config.get(_utility.getConfig('gistId')),
            setName: atom.config.get(_utility.getConfig('setName'))
        }
    ]);
}

function fileDeleteOld () {
    _utility.getDB().deleteOldFile();
}

function openProject (event) {
    event.stopPropagation();
    event.preventDefault();

    const model = _utility.getDB().mapper.get(event.target);
    const eventClick = new CustomEvent('click', { 'detail': this });

    document.getElementById(model.projectId).dispatchEvent(eventClick);
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
        groupView = document.getElementById(chosenModel.groupId);
        clientView = document.getElementById(chosenModel.clientId);
    }
    else if (chosenModel && chosenModel.type === 'group') {
        groupView = chosenView;
        clientView = document.getElementById(chosenModel.clientId);
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

function createModal (type, evt) {
    const modelParent = evt ? _utility.getDB().mapper.get(evt.target) : undefined;
    const model = {};

    if (type) {
        model.type = type;
    }

    if (modelParent) {
        Object.setPrototypeOf(model, modelParent);
    }

    const view = new _modalCreateConstructor();

    _utility.getDB().mapper.set(view, model);

    let modal = atom.workspace.addModalPanel({
        item: view,
        visible: true
    });
}

function togglePanel() {
    const views = _views.get(this);

    if (!views || !views.mainPanel) {
        return;
    }

    views.mainPanel.visible ? views.mainPanel.hide() : views.mainPanel.show();

    if (atom.config.get('project-viewer.visibilityState') === 'Remember state') {
      atom.config.set('project-viewer.visibilityAction', views.mainPanel.visible);
    }
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
        if (atom.config.getAll('project-viewer').length > 0) {
            for (let config in atom.config.getAll('project-viewer')[0].value) {
                if (!_config.hasOwnProperty(config)) {
                    atom.config.unset(_utility.getConfig(config));
                }
            }
        }

        this.disposables = new CompositeDisposable();

        const views = {};

        if (state) {
            // TODO maybe show a CHANGELOG
        }

        views.mainView = new _mainConstructor();
        views.headerView = new _headerConstructor();
        views.containerView = new _listTreeConstructor();

        views.selectView = new _selectView();

        this.disposables.add(
            atom.commands.add('atom-workspace', {
                'project-viewer:toggle-select-view': views.selectView.toggle.bind(views.selectView),
                'project-viewer:toggle-display': togglePanel.bind(this),
                'project-viewer:toggle-focus': toggleFocus.bind(this),
                'project-viewer:create-item': createModal.bind(this, undefined),
                'project-viewer:create-client-item': createModal.bind(this, 'client'),
                'project-viewer:create-group-item': createModal.bind(this, 'group'),
                'project-viewer:create-project-item': createModal.bind(this, 'project'),
                'project-viewer:update-item': updateModal.bind(this),
                'project-viewer:remove-item': removeModal.bind(this),
                'project-viewer:remove-quick-item': removeQuickModal.bind(this),
                'project-viewer:file-backup': fileBackup.bind(this),
                'project-viewer:file-import': fileImport.bind(this),
                'project-viewer:file-delete-old': fileDeleteOld.bind(this),
                'project-viewer:elevate-project': elevateToProject.bind(this),
                'project-viewer:open-new-window': openProject.bind(true),
                'project-viewer:open-same-window': openProject.bind(false)
            }
        ));

        this.disposables.add(
            atom.contextMenu.add({
                'ul[is="pv-list-tree"]': [
                    {
                        label: 'Create Client',
                        command: 'project-viewer:create-client-item',
                        shouldDisplay: (event) => {
                            const model = _utility.getDB().mapper.get(event.target);
                            return !model;
                        }
                    },
                    {
                        label: 'Create Group',
                        command: 'project-viewer:create-group-item',
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
                        command: 'project-viewer:create-project-item',
                        shouldDisplay: (event) => {
                            const model = _utility.getDB().mapper.get(event.target);
                            if (model && model.type === 'project') {
                                return false;
                            }
                            return true;
                        }
                    },
                    {
                        label: 'Open in a new window',
                        command: 'project-viewer:open-new-window',
                        shouldDisplay: (event) => {
                            const model = _utility.getDB().mapper.get(event.target);
                            return model && model.type === 'project' && !event.target.classList.contains('disabled')
                                && !atom.config.get(_utility.getConfig('alwaysOpenInNewWindow'));
                        }
                    },
                    {
                        label: 'Open in the same window',
                        command: 'project-viewer:open-same-window',
                        shouldDisplay: (event) => {
                            const model = _utility.getDB().mapper.get(event.target);
                            return model && model.type === 'project' && !event.target.classList.contains('disabled')
                                && atom.config.get(_utility.getConfig('alwaysOpenInNewWindow'));
                        }
                    }
                ]
            })
        );

        _views.set(this, views);

        this.disposables.add(atom.config.observe(_utility.getConfig('panelPosition'), (value) => {
            let priority = 0;

            if (views.mainPanel && views.mainPanel.destroy) {
                views.mainPanel.destroy();
            }

            views.mainPanel = atom.workspace['add' + value + 'Panel']({
                item: views.mainView,
                visible: atom.config.get('project-viewer.visibilityAction'),
                priority: priority
            });
        }));

        this.disposables.add(atom.config.observe(_utility.getConfig('autohide'), (value) => {
            if (!views.mainPanel) {
                return;
            }
            if (value) {
                views.mainPanel.getItem().classList.add('autohide');
            } else {
                views.mainPanel.getItem().classList.remove('autohide');
            }
        }));

        this.disposables.add(atom.config.observe(_utility.getConfig('hideHeader'), (value) => {
            if (!views.headerView) {
                return;
            }
            if (value) {
                views.headerView.classList.add('autohide');
            } else {
                views.headerView.classList.remove('autohide');
            }
        }));

        this.disposables.add(atom.config.onDidChange(_utility.getConfig('statusBarVisibility'), (status) => {
            if (status.newValue) {
                addToStatusBar.call(this);
            } else {
                removeFromStatusBar.call(this);
            }
        }));

        this.disposables.add(
          atom.config.onDidChange('project-viewer.visibilityState', (newValue) => {
            if (newValue === 'Remember state') {
              let view = caches.get(this);
              const panel = atom.workspace.panelForItem(view);
              atom.config.set('project-viewer.visibilityAction', panel.visible);
            }
          })
        );

        this.disposables.add(
          atom.project.onDidChangePaths((paths) => {
            if (_utility.bypassPathChanges) { return; }
            const selectedModel = _utility.getSelectedProjectModel();
            if (!selectedModel) { return; }
            const type = selectedModel.type;
            if (!type) { return; }
            const selectedPaths = selectedModel[type + 'Paths'];
            const changes = {
                name: selectedModel[type + 'Name'],
                icon: selectedModel[type + 'Icon'],
                sortBy: type === 'project' ? undefined : selectedModel.sortBy
            };
            paths.forEach((_path) => {
                if (selectedPaths.indexOf(_path) === -1) {
                    _utility.updateItem(
                        {
                            current: selectedModel,
                            parent: Object.getPrototypeOf(selectedModel)
                        },
                        Object.assign(changes, {
                            paths: {
                                remove: [],
                                add: [_path]
                            }
                        })
                    );
                }
            });
            selectedPaths.forEach((_path) => {
                if (paths.indexOf(_path) === -1) {
                    _utility.updateItem(
                        {
                            current: selectedModel,
                            parent: Object.getPrototypeOf(selectedModel)
                        },
                        Object.assign(changes, {
                            paths: {
                                remove: [_path],
                                add: []
                            }
                        })
                    );
                }
            });
          })
        );

        views.containerView.setAsRootLevel();
        views.mainView.addNode(views.headerView);
        views.mainView.addNode(views.containerView);

        updateProjectViewer.call(this);

        githubWorker.onmessage = githubWorkerOnMessage.bind(this);

        views.atomSyle = _colors.initialize();

        this.disposables.add(atom.config.observe(_utility.getConfig('customSelectedColor'), (value) => {
          const regEx = new RegExp('^#(?:[0-9a-f]{3}){1,2}$', 'i');
          const parsed = regEx.exec(value);
          if (!parsed) {
            _colors.unsetSelectedColor();
            return;
          }
          _colors.setSelectedColor(parsed[0]);
        }));

        this.disposables.add(atom.config.observe(_utility.getConfig('customHoverColor'), (value) => {
          const regEx = new RegExp('^#(?:[0-9a-f]{3}){1,2}$', 'i');
          const parsed = regEx.exec(value);
          if (!parsed) {
            _colors.unsetHoverColor();
            return;
          }
          _colors.setHoverColor(parsed[0]);
        }));

        this.disposables.add(atom.config.observe(_utility.getConfig('customTitleColor'), (value) => {
          const regEx = new RegExp('^#(?:[0-9a-f]{3}){1,2}$', 'i');
          const parsed = regEx.exec(value);
          if (!parsed) {
            _colors.unsetTitleColor();
            return;
          }
          _colors.setTitleColor(parsed[0]);
        }));
    },
    serialize: function serialize() {},
    deactivate: function deactivate() {
        const views = _views.get(this);

        this.disposables.dispose();

        if (!views) {
            return;
        }

        views.mainPanel && views.mainPanel.destroy();
        this.statusBarTile && this.statusBarTile.destroy();
        _colors.destroy();
    },
    consumeStatusBar: function consumeStatusBar(statusBar) {
        this.statusBar = statusBar;
        if (atom.config.get(_utility.getConfig('startupVisibility')) && atom.config.get(_utility.getConfig('statusBarVisibility'))) {
            addToStatusBar.call(this);
        }
    }
};

module.exports = projectViewer;
