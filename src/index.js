'use strict';

// =============================================================================

let component = {
    constructors: {},
    register: function initialize(elementObj, model) {
        let customElement;
        let elementExtends;

        if (!model) {
            throw Error('Should implement a model object');
        }

        if (elementObj && elementObj.hasOwnProperty('custom')) {
            customElement = elementObj.custom;
        } else {
            throw Error('Not a valid custom element for registration');
            return;
        }

        if (elementObj.hasOwnProperty('extends')) {
            elementExtends = elementObj.extends;
        }

        if (this.constructors[customElement]) {
            return this.constructors[customElement];
        }

        let registers = {
            prototype: model
        };

        if (elementExtends) {
            registers.extends = elementExtends;
        }

        this.constructors[customElement] = document.registerElement(
            customElement,
            registers
        );

        Object.setPrototypeOf(model, HTMLElement.prototype);

        return this.constructors[customElement];
    }
};

// =============================================================================

let statusBarModel = {
    createdCallback: function createdCallback() {
        if (!this.children) {
            this.children = {};
        }

        this.classList.add('inline-block');

        this.children.span = document.createElement('span');
        this.appendChild(this.children.span);
    },
    setText: function setText(text) {
        this.children.span.textContent = text;
    }
};

let mainModel = {
    createdCallback: function createdCallback() {
        if (!this.children) {
            this.children = {};
        }

        this.setAttribute('tabindex', '-1');
    }
};

let topicModel = {
    createdCallback: function createdCallback() {
        this.textContent = 'Project Viewer';
    },
    appendTo: function appendTo(node) {
        node.appendChild(this);
    }
};

let clientsModel = {
    createdCallback: function createdCallback() {
        if (!this.children) {
            this.children = {};
        }

        this.classList.add('list-tree', 'has-collapsable-children');
    },
    appendTo: function appendTo(node) {
        node.appendChild(this);
    },
    removeFrom: function removeFrom(node) {
        node.removeChild(this);
    }
};

let clientModel = {
    createdCallback: function createdCallback() {
        if (!this.children) {
            this.children = {};
        }

        this.classList.add('list-nested-item');

        this.children.div = document.createElement('div');
        this.children.div.classList.add('list-item');
        this.children.div.addEventListener('click', () => {
            this.toggle();
        });
        this.children.span = document.createElement('span');

        this.children.div.appendChild(this.children.span);
        this.appendChild(this.children.div);
    },
    attachedCallback: function attachedCallback() {},
    detachedCallback: function detachedCallback() {},
    attributeChangedCallback: function attributeChangedCallback(attr, oldValues, newValues) {},
    setText: function setText(text) {
        this.children.span.textContent = text;
    },
    setIcon: function setIcon(icon) {
        this.children.span.classList.add('icon', icon);
    },
    removeIcon: function setIcon(icon) {
        this.children.span.classList.remove('icon', icon);
    },
    appendTo: function appendTo(node) {
        node.appendChild(this);
    },
    removeFrom: function removeFrom(node) {
        node.removeChild(this);
    },
    setChild: function setChild(ref, node) {
        this.children[ref] = node;
    },
    unsetChild: function unsetChild(ref) {
        delete this.children[name];
    },
    toggle: function toggle() {
        this.classList.toggle('collapsed');
        this.classList.toggle('expanded');
    },
    expand: function expand() {
        this.classList.remove('collapsed');
        this.classList.add('expanded');
    },
    collapse: function collapse() {
        this.classList.remove('expanded');
        this.classList.add('collapsed');
    }
};

let groupsModel = {
    createdCallback: function createdCallback() {
        if (!this.children) {
            this.children = {};
        }

        this.classList.add('list-tree', 'has-collapsable-children');
    },
    appendTo: function appendTo(node) {
        node.appendChild(this);
    },
    removeFrom: function removeFrom(node) {
        node.removeChild(this);
    }
};

let groupModel = {
    createdCallback: function createdCallback() {
        if (!this.children) {
            this.children = {};
        }

        this.classList.add('list-nested-item');

        this.children.div = document.createElement('div');
        this.children.div.classList.add('list-item');
        this.children.div.addEventListener('click', () => {
            this.toggle();
        });
        this.children.span = document.createElement('span');

        this.children.div.appendChild(this.children.span);
        this.appendChild(this.children.div);
    },
    setText: function setText(text) {
        this.children.span.textContent = text;
    },
    setIcon: function setIcon(icon) {
        this.children.span.classList.add('icon', icon);
    },
    removeIcon: function setIcon(icon) {
        this.children.span.classList.remove('icon', icon);
    },
    appendTo: function appendTo(node) {
        node.appendChild(this);
    },
    removeFrom: function removeFrom(node) {
        node.removeChild(this);
    },
    setChild: function setChild(ref, node) {
        this.children[ref] = node;
    },
    unsetChild: function unsetChild(ref) {
        delete this.children[name];
    },
    toggle: function toggle() {
        this.classList.toggle('collapsed');
        this.classList.toggle('expanded');
    },
    expand: function expand() {
        this.classList.remove('collapsed');
        this.classList.add('expanded');
    },
    collapse: function collapse() {
        this.classList.remove('expanded');
        this.classList.add('collapsed');
    }
};

let projectsModel = {
    createdCallback: function createdCallback() {
        if (!this.children) {
            this.children = {};
        }

        this.classList.add('list-tree');
    },
    appendTo: function appendTo(node) {
        node.appendChild(this);
    },
    removeFrom: function removeFrom(node) {
        node.removeChild(this);
    }
};

let projectModel = {
    createdCallback: function createdCallback() {
        if (!this.children) {
            this.children = {};
        }

        this.classList.add('list-item');

        this.children.span = document.createElement('span');

        this.appendChild(this.children.span);

        this.addEventListener('click', () => {
            let project = pv.searchProject({
                name: this.children.span.textContent
            })[0];

            if (!project) {
                return;
            }

            project.openState();
        });
    },
    setModel: function setModel(model) {
        this.model = model;
    },
    setText: function setText(text) {
        this.children.span.textContent = text;
    },
    appendTo: function appendTo(node) {
        node.appendChild(this);
    },
    removeFrom: function removeFrom(node) {
        node.removeChild(this);
    }
};

// =============================================================================

let statusBarConstructor = component.register({
    custom: 'pv-status-bar'
}, statusBarModel);

let mainConstructor = component.register({
    custom: 'project-viewer'
}, mainModel);

let topicConstructor = component.register({
    custom: 'pv-topic'
}, topicModel);


let clientsConstructor = component.register({
    custom: 'pv-clients',
    extends: 'ul'
}, clientsModel);

let clientConstructor = component.register({
    custom: 'pv-client',
    extends: 'li'
}, clientModel);

let groupsConstructor = component.register({
    custom: 'pv-groups',
    extends: 'ul'
}, groupsModel);

let groupConstructor = component.register({
    custom: 'pv-group',
    extends: 'li'
}, groupModel);

let projectsConstructor = component.register({
    custom: 'pv-projects',
    extends: 'ul'
}, projectsModel);

let projectConstructor = component.register({
    custom: 'pv-project',
    extends: 'li'
}, projectModel);

// =============================================================================

let pv = {
    statusBar: null,
    statusBarTile: null,
    selectListView: null,
    config: {
        startupVisibility: {
            description: 'Define if you want **project-viewer** to be visible on startup.',
            type: 'boolean',
            default: false,
            order: 0
        },
        statusBarVisibility: {
            description: 'Define if you want **project-viewer** to show active *group* and *project*.',
            type: 'boolean',
            default: false,
            order: 1
        },
        autohide: {
            description: 'Hability to autohide project viewer',
            type: 'boolean',
            default: false,
            order: 2
        },
        keepProjectState: {
            description: 'Set to false will not keep track of each project\´s **tree-view** folder state',
            type: 'boolean',
            default: true,
            order: 3
        }
    },
    addToStatusBar: function addToStatusBar() {
        let project = this.searchProject({
            paths: atom.project.getPaths()
        })[0],
            view;

        view = new statusBarConstructor();

        if (project) {
            view.setText(project.getProjectGroup().name
                .concat(' / ')
                .concat(project.getProject().name));
        } else {
            view.setText('no project selected!');
        }

        this.statusBarTile = this.statusBar.addRightTile({
            item: view,
            priority: 0
        });
    },
    removeToStatusBar: function removeToStatusBar() {
        this.statusBarTile.destroy();
    },
    consumeStatusBar (statusBar) {
        let project = this.searchProject({
            paths: atom.project.getPaths()
        })[0],
            view;

        this.statusBar = statusBar;

        if (atom.config.get('project-viewer2.statusBarVisibility')) {
            this.addToStatusBar();
        }
    },
    activate: function activate() {

        process.nextTick(() => {
            if (!this.children) {
                this.children = {};
            }

            this.children.mainView = new mainConstructor();
            this.children.topicView = new topicConstructor();
            this.children.clientsView = new clientsConstructor();

            this.children.topicView.appendTo(this.children.mainView);
            this.children.clientsView.appendTo(this.children.mainView);

            this.panel = atom.workspace.addRightPanel({
                item: this.children.mainView,
                visible: true
            });

            this.populate();

            this.selectListView = new PVSelectListView();

            atom.config.onDidChange('project-viewer2.statusBarVisibility', (status) => {
                if (status.newValue) {
                    this.addToStatusBar();
                } else {
                    this.removeToStatusBar();
                }
            });
        });
    },
    serialize: function serialize() {},
    deactivate: function deactivate() {
        this.selectListView.cancel();
        this.statusBarTile.destroy();
        this.statusBarTile = null;
    },
    populate: function populate() {
        this.storage.clients.forEach((clientStored) => {
            let client = Object.assign({
                client: {
                    name: '',
                    icon: '',
                    expanded: true,
                    view: new clientConstructor()
                }
            }, this.client_methods);
            client.setClientName(clientStored.name);
            client.setClientIcon(clientStored.icon);
            this.db.clients.push(client);

            client.client.view.setText(client.client.name);
            client.client.view.appendTo(this.children.clientsView);

            let groupsView = new groupsConstructor();
            groupsView.appendTo(client.client.view);

            if (!clientStored.groups) {
                return;
            }

            clientStored.groups.forEach((groupStored) => {
                let group = Object.assign({
                    group: {
                        name: '',
                        icon: '',
                        expanded: true,
                        view: new groupConstructor()
                    }
                }, this.group_methods);
                group.setGroupName(groupStored.name);
                group.setGroupIcon(groupStored.icon);
                Object.setPrototypeOf(group, client);
                this.db.groups.push(group);

                group.group.view.setText(group.group.name);
                group.group.view.appendTo(groupsView);

                let projectsView = new projectsConstructor();
                projectsView.appendTo(group.group.view);

                if (!groupStored.projects) {
                    return;
                }

                groupStored.projects.forEach((projectStored) => {
                    let project = Object.assign({
                        project: {
                            name: '',
                            icon: '',
                            paths: [],
                            selected: false,
                            view: new projectConstructor()
                        }
                    }, this.project_methods);
                    project.setProjectName(projectStored.name);
                    project.setProjectPaths(projectStored.paths);
                    Object.setPrototypeOf(project, group);
                    this.db.projects.push(project);

                    project.project.view.setText(project.project.name);
                    project.project.view.setModel(projectStored);
                    project.project.view.appendTo(projectsView);
                });
            });
        });
    },
    storage: atom.getStorageFolder().load('project-viewer2.json'),
    store: {
        clients: []
    },
    db: {
        clients: [],
        groups: [],
        projects: []
    },
    selectedProject: null,
    projectSerialization: function projectSerialization() {
        return atom.project.serialize();
    },
    projectDeserialization: function projectDeserialization(serialization) {
        if (!serialization) {
            return;
        }
        atom.project.deserialize(serialization, atom.deserializers);
    },
    workspaceSerialization: function workspaceSerialization() {
        return atom.workspace.serialize();
    },
    workspaceDeserialization: function workspaceDeserialization(serialization) {
        if (!serialization) {
            return;
        }
        atom.workspace.deserialize(serialization, atom.deserializers);
    },
    treeViewSerialization: function treeViewSerialization() {
        let pkg = atom.packages.getActivePackage('tree-view');

        if (!pkg) {
            return;
        };

        return pkg.mainModule.treeView.serialize();
    },
    treeViewDeserialization: function treeViewDeserialization(serialization) {
        let pkg = atom.packages.getActivePackage('tree-view');

        if (!pkg || !serialization || !serialization.directoryExpansionStates) {
            return;
        }
        pkg.mainModule.treeView.updateRoots(serialization.directoryExpansionStates);
    },
    updateGroupClient: function updateGroupClient(group, client) {
        Object.setPrototypeOf(group, client);
    },
    client_methods: {
        setClientName: function setClientName(name) {
            this.client.name = name;
        },
        setClientIcon: function setClientIcon(icon) {
            this.client.icon = icon;
        },
        getClient: function getClient() {
            return this.client;
        },
        isClientExpanded: function isClientExpanded() {
            return this.client.expanded;
        }
    },
    group_methods: {
        setGroupName: function setGroupName(name) {
            this.group.name = name;
        },
        setGroupIcon: function setGroupIcon(icon) {
            this.group.icon = icon;
        },
        getGroup: function getGroup() {
            return this.group;
        },
        getGroupClient: function getGroupClient() {
            return this.getClient();
        },
        isGroupExpanded: function isGroupExpanded() {
            return this.group.expanded;
        }
    },
    project_methods: {
        openState: function openState() {
            let serializationFile,
                serialization,
                project;

            serializationFile = atom.getStateKey(
                this.getProject().paths
            );

            if (serializationFile) {
                serialization = atom.storageFolder.load(serializationFile);
            }

            project = this.getProject();

            if (serialization) {
                pv.projectDeserialization(serialization.project);
                pv.workspaceDeserialization(serialization.workspace);
                pv.treeViewDeserialization(serialization.treeview);
            } else {
                atom.project.setPaths(project.paths);
            }

            pv.storeDB();

            pv.statusBar.setText(this.getProjectGroup().name
                .concat(' / ')
                .concat(project.name));
        },
        setProjectName: function setProjectName(name) {
            this.getProject().name = name;
        },
        setProjectPaths: function setProjectPaths(paths) {
            this.getProject().paths = paths;
        },
        getProject: function getProject() {
            return this.project;
        },
        getProjectGroup: function getProjectGroup() {
            return this.getGroup();
        },
        getProjectClient: function getProjectClient() {
            return this.getGroupClient();
        },
        isGroupExpanded: function isGroupExpanded() {
            return this.group.expanded;
        }
    },

    searchClient: function searchClient(byProps) {
        let matches = [];
        this.db.clients.forEach(
            (clientListed) => {
                let match = Object.keys(byProps).every(
                    (prop) => {
                        return byProps[prop] === clientListed.client[prop];
                    }
                );
                if (match) {
                    matches.push(clientListed);
                }
            }
        );
        return matches;
    },
    searchGroup: function searchGroup(byProps) {
        let matches = [];
        this.db.groups.forEach(
            (groupListed) => {
                let match = Object.keys(byProps).every(
                    (prop) => {
                        return byProps[prop] === groupListed.group[prop];
                    }
                );
                if (match) {
                    matches.push(groupListed);
                }
            }
        );
        return matches;
    },
    searchProject: function searchProject(byProps) {
        let matches = [];
        this.db.projects.forEach(
            (projectListed) => {
                let match = Object.keys(byProps).every(
                    (prop) => {
                        if (Array.isArray(byProps[prop]) && projectListed.project[prop].length) {
                            return projectListed.project[prop].every((path) => {
                                return byProps[prop].indexOf(path) !== -1;
                            });
                        }
                        return byProps[prop] === projectListed.project[prop];
                    }
                );
                if (match) {
                    matches.push(projectListed);
                }
            }
        );
        return matches;
    },
    addClient: function addClient(candidate) {
        let isNew = !this.store.clients.some(
            (client) => {
                return candidate.name === client.name;
            }
        );
        if (isNew || !this.store.clients.length) {
            return this.store.clients.push({
                name: candidate.name,
                icon: candidate.icon,
                expanded: candidate.expanded,
                groups: []
            });
        }
        return -1;
    },
    addGroup: function addGroup(candidate, forClient) {
        let idx = this.store.clients.findIndex(
            (client) => {
                return forClient.name === client.name;
            });
        if (idx === -1) {
            return -1;
        }

        let isNew = !this.store.clients[idx].groups.some(
            (group) => {
                return candidate.name === group.name;
            }
        );
        if (isNew || !this.store.clients[idx].groups.length) {
            return this.store.clients[idx].groups.push({
                name: candidate.name,
                icon: candidate.icon,
                expanded: candidate.expanded,
                projects: []
            });
        }
        return -1;
    },
    addProject: function addProject(candidate, forGroup, forClient) {
        let c_idx = this.store.clients.findIndex(
            (client) => {
                return forClient.name === client.name;
            }),
            g_idx = this.store.clients[c_idx].groups.findIndex(
            (group) => {
                return forGroup.name === group.name;
            });

        if (c_idx === -1 || g_idx === -1) {
            return -1;
        }

        let isNew = !this.store.clients[c_idx].groups[g_idx].projects.some(
            (project) => {
                return candidate.name === project.name;
            }
        );

        if (isNew || !this.store.clients[c_idx].groups[g_idx].projects.length) {
            return this.store.clients[c_idx].groups[g_idx].projects.push({
                name: candidate.name,
                paths: candidate.paths,
                serializationFile: candidate.serializationFile
            });
        }
        return -1;
    },
    storeDB: function storeDB() {
        this.db.clients.forEach((client) => {
            let currentClient = client.getClient();

            this.addClient(currentClient);
        });

        this.db.groups.forEach((group) => {
            let currentClient = group.getGroupClient(),
            currentGroup = group.getGroup();

            this.addClient(currentClient);

            this.addGroup(
                currentGroup,
                currentClient
            );
        });

        this.db.projects.forEach((project) => {
            let currentClient = project.getProjectClient(),
            currentGroup = project.getProjectGroup(),
            currentProject = project.getProject();

            this.addClient(currentClient);

            this.addGroup(
                currentGroup,
                currentClient
            );

            this.addProject(
                currentProject,
                currentGroup,
                currentClient
            );
        });

        atom.getStorageFolder().store('project-viewer2.json', this.store);
    }
};

module.exports = pv;






const SelectListView = require('atom-space-pen-views').SelectListView,
$$ = require('atom-space-pen-views').$$;

class PVSelectListView extends SelectListView {

    constructor () {
        super();

        atom.commands.add(
            'atom-workspace',
            'project-viewer2:toggle',
            this.toggle.bind(this)
        );
        this.setLoading('loading projects');
    }

    viewForItem (item) {
        return $$(function() {
            return this.li({
                class: 'two-lines'
            }, () => {
                this.div({
                    class: 'status icon '.concat(item.getProjectGroup().icon)
                });
                this.div({
                    class: 'primary-line no-icon'
                }, () => {
                    return this.text(item.getProject().name);
                });
                this.div({
                    class: 'primary-secondary no-icon'
                }, () => {
                    return this.text(
                        item.getProjectClient().name
                        .concat(' / ')
                        .concat(item.getProjectGroup().name)
                    );
                });
                return this;
            });
        });
    }

    confirmed (item) {
        let serializationFile,
        serialization,
        project,
        currentProject;

        if (pv.selectedProject) {
            currentProject = pv.searchProject(
                pv.selectedProject.getProject()
            )[0];

            serializationFile = atom.getStateKey(
                pv.selectedProject.getProject().paths
            );
        }

        if (serializationFile) {
            atom.storageFolder.store(
                serializationFile,
                {
                    project: pv.projectSerialization(),
                    workspace: pv.workspaceSerialization(),
                    treeview: pv.treeViewSerialization()
                }
            );
        }

        project = pv.searchProject(
            item.getProject()
        )[0];

        if (!project) {
            this.cancel();
        }

        pv.selectedProject = project;

        pv.selectedProject.openState();

        this.cancel();
    }

    cancel () {
        this.hide();
    }

    selectPreviousItemView () {
        let view = this.getSelectedItemView().prev();
        if (!view.length) {
            view = this.list.find('li:last');
        }
        return this.selectItemView(view);
    }

    selectNextItemView () {
        let view = this.getSelectedItemView().next();
        if (!view.length) {
            view = this.list.find('li:first');
        }
        return this.selectItemView(view);
    }

    show () {
        this.storeFocusedElement();
        if (!this.panel) {
            this.panel = atom.workspace.addModalPanel({
                item: this
            });
        }
        this.setItems(pv.db.projects);
        this.panel.show();
        this.scrollToItemView(this.list.find('li:first'));
        this.focusFilterEditor();
    }

    hide () {
        if (this.panel) {
            this.list.empty();
            this.panel.hide();
        }
    }

    toggle () {
        if (this.panel && this.panel.isVisible()) {
            this.hide();
        } else {
            this.show();
        }
    }
}
