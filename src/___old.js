// =============================================================================

let component = {
    constructors: {},
    register: function register(elementObj, model) {
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

let statusInfoModel = {
    createdCallback: function createdCallback() {
        if (!this.children) {
            this.children = {};
        }

        this.children.span = document.createElement('span');
        this.children.span.classList.add('icon', 'icon-primitive-dot');

        this.appendChild(this.children.span);
    },
    appendTo: function appendTo(node) {
        node.appendChild(this);
    }
}

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

        this.classList.add('list-nested-item', 'collapsed');

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
    getText: function getText() {
        return this.children.span.textContent;
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
    getText: function getText() {
        return this.children.span.textContent;
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
            let project;

            if (pv.selectedProject) {
                pv.selectedProject.getProject().view.classList.remove('selected');
                pv.selectedProject.closeState();
            }

            project = pv.searchProject({
                name: this.children.span.textContent
            });

            if (!project.length) {
                return;
            }

            project = project.filter((projectListed) => {
                return projectListed.getProjectClient().name === this.getAttribute('data-client')
                    && projectListed.getProjectGroup().name === this.getAttribute('data-group');
            });

            if (project.length !== 1) {
                return;
            }

            pv.selectedProject = project[0];
            pv.selectedProject.getProject().view.classList.add('selected');
            pv.selectedProject.openState();
            pv.storeDB();
        });
    },
    setDataGroup: function setDataGroup(group) {
        this.setAttribute('data-group', group);
    },
    setDataClient: function setDataClient(client) {
        this.setAttribute('data-client', client);
    },
    setText: function setText(text) {
        this.children.span.textContent = text;
    },
    getText: function getText() {
        return this.children.span.textContent;
    },
    appendTo: function appendTo(node) {
        node.appendChild(this);
    },
    removeFrom: function removeFrom(node) {
        node.removeChild(this);
    }
};

let addClientModel = {
    createdCallback: function createdCallback() {
        if (!this.children) {
            this.children = {};
        }

        this.children.topic = document.createElement('h1');
        this.children.topic.classList.add('block');
        this.children.topic.textContent = 'Add a new client';

        this.children.inputName = document.createElement('atom-text-editor');
        this.children.inputName.setAttribute('mini', true);

        this.children.error = document.createElement('div');
        this.children.error.classList.add('block', 'error-message');
        this.children.error.textContent = 'add a new client!';

        this.children.save = document.createElement('div');
        this.children.save.classList.add('inline-block');
        this.children.saveText = document.createElement('button');
        this.children.saveText.classList.add('btn', 'btn-primary');
        this.children.saveText.textContent = 'add';
        this.children.save.addEventListener('click', () => {
            let name = this.children.inputName.getModel().buffer.getText();

            if (name.trim().length) {
                pv.newClient({
                    name: name
                });
                pv.storeDB();
                pv.ui();
                pv.populate();
            }

            atom.workspace.panelForItem(this).destroy();
        });

        this.children.cancel = document.createElement('div');
        this.children.cancel.classList.add('inline-block');
        this.children.cancelText = document.createElement('button');
        this.children.cancelText.classList.add('btn');
        this.children.cancelText.textContent = 'cancel';
        this.children.cancel.addEventListener('click', () => {
            atom.workspace.panelForItem(this).destroy();
        });

        this.children.save.appendChild(this.children.saveText);
        this.children.cancel.appendChild(this.children.cancelText);

        this.appendChild(this.children.topic);
        this.appendChild(this.children.inputName);
        this.appendChild(this.children.error);
        this.appendChild(this.children.save);
        this.appendChild(this.children.cancel);
    },
    appendTo: function appendTo(node) {
        node.appendChild(this);
    },
    removeFrom: function removeFrom(node) {
        node.removeChild(this);
    }
};

let removeClientModel = {
    createdCallback: function createdCallback() {
        if (!this.children) {
            this.children = {};
        }

        this.children.topic = document.createElement('h1');
        this.children.topic.classList.add('block');
        this.children.topic.textContent = 'Remove an existing client';

        this.children.inputName = document.createElement('atom-text-editor');
        this.children.inputName.setAttribute('mini', true);

        this.children.error = document.createElement('div');
        this.children.error.classList.add('block', 'error-message');
        this.children.error.textContent = 'remove an existing client from the list!';

        this.children.save = document.createElement('div');
        this.children.save.classList.add('inline-block');
        this.children.saveText = document.createElement('button');
        this.children.saveText.classList.add('btn', 'btn-error');
        this.children.saveText.textContent = 'remove';
        this.children.save.addEventListener('click', () => {
            let name = this.children.inputName.getModel().buffer.getText();

            if (name.trim().length) {
                pv.deleteClient({
                    name: name
                });
                pv.storeDB();
                pv.ui();
                pv.populate();
            }

            atom.workspace.panelForItem(this).destroy();
        });

        this.children.cancel = document.createElement('div');
        this.children.cancel.classList.add('inline-block');
        this.children.cancelText = document.createElement('button');
        this.children.cancelText.classList.add('btn');
        this.children.cancelText.textContent = 'cancel';
        this.children.cancel.addEventListener('click', () => {
            atom.workspace.panelForItem(this).destroy();
        });

        this.children.save.appendChild(this.children.saveText);
        this.children.cancel.appendChild(this.children.cancelText);

        this.appendChild(this.children.topic);
        this.appendChild(this.children.inputName);
        this.appendChild(this.children.error);
        this.appendChild(this.children.save);
        this.appendChild(this.children.cancel);

        this.children.inputName.focus();
    },
    appendTo: function appendTo(node) {
        node.appendChild(this);
    },
    removeFrom: function removeFrom(node) {
        node.removeChild(this);
    }
};

// =============================================================================

const statusBarConstructor = component.register({
    custom: 'pv-status-bar'
}, statusBarModel);

const statusInfoConstructor = component.register({
    custom: 'pv-status-info'
}, statusInfoModel);

const mainConstructor = component.register({
    custom: 'project-viewer'
}, mainModel);

const topicConstructor = component.register({
    custom: 'pv-topic'
}, topicModel);

const clientsConstructor = component.register({
    custom: 'pv-clients',
    extends: 'ul'
}, clientsModel);

const clientConstructor = component.register({
    custom: 'pv-client',
    extends: 'li'
}, clientModel);

const groupsConstructor = component.register({
    custom: 'pv-groups',
    extends: 'ul'
}, groupsModel);

const groupConstructor = component.register({
    custom: 'pv-group',
    extends: 'li'
}, groupModel);

const projectsConstructor = component.register({
    custom: 'pv-projects',
    extends: 'ul'
}, projectsModel);

const projectConstructor = component.register({
    custom: 'pv-project',
    extends: 'li'
}, projectModel);

const addClientConstructor = component.register({
    custom: 'pv-add-client',
    extends: 'div'
}, addClientModel);

const removeClientConstructor = component.register({
    custom: 'pv-remove-client',
    extends: 'div'
}, removeClientModel);

// =============================================================================

const db = {
    createClientsPool: function createClientsPool() {
        return {
            clientsSort: 'alphabetic',
            getClientsView: function getClientsView() {
                return this.clientsView;
            },
            getClientsSort: function getSort() {
                return this.clientsSort;
            },
            setClientsSort: function setSort(type) {
                this.clientsSort = type;
            },
            appendClientsTo: function appendClientsTo(node) {
                node.appendChild(this.getClientsView());
            },
            sortClientsChildren: function sortClientsChildren() {
                let view = this.getClientsView();
                let sort = this.getClientsSort();
                let children = Array.apply(null, view.childNodes);
                let reverse = sort.includes('reverse') ? -1 : 1;
                let results = children.sort((currentNode, nextNode) => {
                    let result;

                    if (sort.includes('alphabetic')) {
                        result = reverse * new Intl.Collator().compare(
                            currentNode.getText(),
                            nextNode.getText()
                        );
                    } else if (sort.includes('position')) {
                        result = -reverse;
                    }
                    if (result === 1) {
                        view.insertBefore(nextNode, currentNode);
                    }
                    return result;
                });
            },
            clientsView: new clientsConstructor()
        };
    },
    createClient: function createClient() {
        return {
            clientName: '',
            clientIcon: '',
            clientExpanded: false,
            getClientView: function getView() {
                return this.clientView;
            },
            setClientName: function setClientName(name) {
                this.clientName = name;
            },
            setClientIcon: function setClientIcon(icon) {
                this.clientIcon = icon;
            },
            setClientExpanded: function setClientExpanded(state) {
                this.clientExpanded = state;
            },
            appendClientTo: function appendClientTo(node) {
                node.appendChild(this.getClientView());
            },
            clientView: new clientConstructor()
        };
    },
    createGroupsPool: function createGroupsPool() {
        return {
            groupsSort: 'alphabetic',
            getGroupsView: function getView() {
                return this.groupsView;
            },
            getGroupsSort: function getSort() {
                return this.groupsSort;
            },
            appendGroupsTo: function appendGroupsTo(node) {
                node.appendChild(this.getGroupsView());
            },
            sortGroupsChildren: function sortGroupsChildren() {
                let view = this.getGroupsView();
                let sort = this.getGroupsSort();
                let children = Array.apply(null, view.childNodes);
                let reverse = sort.includes('reverse') ? -1 : 1;
                let results = children.sort((currentNode, nextNode) => {
                    let result;

                    if (sort.includes('alphabetic')) {
                        result = reverse * new Intl.Collator().compare(
                            currentNode.getText(),
                            nextNode.getText()
                        );
                    } else if (sort.includes('position')) {
                        result = -reverse;
                    }
                    if (result === 1) {
                        view.insertBefore(nextNode, currentNode);
                    }
                    return result;
                });
            },
            groupsView: new groupsConstructor()
        };
    },
    createGroup: function createGroup() {
        return {
            groupName: '',
            groupIcon: '',
            groupExpanded: false,
            getGroupView: function getView() {
                return this.groupView;
            },
            setGroupName: function setGrouptName(name) {
                this.groupName = name;
            },
            setGroupIcon: function setGroupIcon(icon) {
                this.groupIcon = icon;
            },
            setGroupExpanded: function setGroupExpanded(state) {
                this.groupExpanded = state;
            },
            appendGroupTo: function appendGroupTo(node) {
                node.appendChild(this.getGroupView());
            },
            groupView: new groupConstructor()
        };
    },
    createProjectsPool: function createProjectsPool() {
        return {
            projectsSort: 'alphabetic',
            getProjectsView: function getView() {
                return this.projectsView;
            },
            getProjectsSort: function getSort() {
                return this.projectsSort;
            },
            appendProjectsTo: function appendProjectsTo(node) {
                node.appendChild(this.getProjectsView());
            },
            sortProjectsChildren: function sortProjectsChildren() {
                let view = this.getProjectsView();
                let sort = this.getProjectsSort();
                let children = Array.apply(null, view.childNodes);
                let reverse = sort.includes('reverse') ? -1 : 1;
                let results = children.sort((currentNode, nextNode) => {
                    let result;

                    if (sort.includes('alphabetic')) {
                        result = reverse * new Intl.Collator().compare(
                            currentNode.getText(),
                            nextNode.getText()
                        );
                    } else if (sort.includes('position')) {
                        result = -reverse;
                    }
                    if (result === 1) {
                        view.insertBefore(nextNode, currentNode);
                    }
                    return result;
                });
            },
            projectsView: new projectsConstructor()
        };
    },
    createProject: function createProject() {
        return {
            projectName: '',
            projectSelected: false,
            getProjectView: function getView() {
                return this.projectView;
            },
            setProjectName: function setProjectName(name) {
                this.projectName = name;
            },
            setProjectSelected: function setProjectSelected(state) {
                this.projectSelected = state;
            },
            appendProjectTo: function appendProjectTo(node) {
                node.appendChild(this.getProjectView());
            },
            projectView: new projectConstructor()
        };
    },
    initialize: function initialize() {
        let file = {};
        file = {
            clients: [
                {
                    name: 'client Z',
                    groups: [
                        {
                            name: 'group Z',
                            projects: [
                                {
                                    name: 'project Y'
                                },
                                {
                                    name: 'project C'
                                }
                            ]
                        },
                        {
                            name: 'group A',
                            projects: [
                                {
                                    name: 'project W'
                                },
                                {
                                    name: 'project D'
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'client A',
                    groups: [
                        {
                            name: 'group X',
                            projects: [
                                {
                                    name: 'project M'
                                },
                                {
                                    name: 'project E'
                                }
                            ]
                        },
                        {
                            name: 'group B',
                            projects: [
                                {
                                    name: 'project N'
                                },
                                {
                                    name: 'project F'
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        let efile = {
            groups: [
                {
                    name: 'group X',
                    projects: [
                        {
                            name: 'project M'
                        },
                        {
                            name: 'project E'
                        }
                    ]
                },
                {
                    name: 'group B',
                    projects: [
                        {
                            name: 'project N'
                        },
                        {
                            name: 'project F'
                        }
                    ]
                }
            ]
        };

        const DB = {
            clientsPool: [],
            clientsList: [],
            groupsPool: [],
            groupsList: [],
            projectsPool: [],
            projectsList: [],
        };

        function errorOccurance(options) {
            const Notification = require('atom').Notification;
            atom.notifications.addNotification(
                new Notification(
                    'warning',
                    '<strong>Project Viewer</strong><br>Database not valid!',
                    options
                )
            );
        }

        function process3Levels () {
            if (!file) {
                errorOccurance({
                    icon: 'database',
                    detail: 'File did not exist!'
                });
                return;
            }
            if (!file.hasOwnProperty('clients')) {
                errorOccurance({
                    icon: 'database',
                    detail: 'File did not contain any clients as a first level!'
                });
                return;
            }

            const clientsPool = this.createClientsPool();
            DB.clientsPool.push(clientsPool);

            file.clients.forEach(function (clientItem) {
                const client = new this.createClient();
                const clientView = client.getClientView();

                Object.setPrototypeOf(client, clientsPool);

                client.setClientName(clientItem.name);
                clientView.setText(clientItem.name);
                client.appendClientTo(clientsPool.getClientsView());

                DB.clientsList.push(client);

                if (!clientItem.groups) {
                    return;
                }

                const groupsPool = this.createGroupsPool();
                Object.setPrototypeOf(groupsPool, client);

                DB.groupsPool.push(groupsPool);

                groupsPool.appendGroupsTo(clientView);

                clientItem.groups.forEach(function (groupItem) {
                    const group = new this.createGroup();
                    const groupView = group.getGroupView();

                    Object.setPrototypeOf(group, groupsPool);

                    group.setGroupName(groupItem.name);
                    groupView.setText(groupItem.name);
                    group.appendGroupTo(groupsPool.getGroupsView());

                    DB.groupsList.push(group);

                    if (!groupItem.projects) {
                        return;
                    }

                    const projectsPool = this.createProjectsPool();
                    Object.setPrototypeOf(projectsPool, group);

                    DB.projectsPool.push(projectsPool);

                    projectsPool.appendProjectsTo(groupView);

                    groupItem.projects.forEach(function (projectItem) {
                        const project = new this.createProject();
                        const projectView = project.getProjectView();

                        Object.setPrototypeOf(project, projectsPool);

                        project.setProjectName(projectItem.name);
                        projectView.setText(projectItem.name);
                        project.appendProjectTo(projectsPool.getProjectsView());

                        DB.projectsList.push(project);
                    }, this);
                }, this);
            }, this);

            if (!DB.clientsPool.length) {
                return;
            }


            let view = new mainConstructor();
            this.panel = atom.workspace.addRightPanel({
                item: view,
                visible: atom.config.get('project-viewer2.startupVisibility')
            });

            view.appendChild(DB.clientsPool[0].clientsView);
        }

        function process2Levels () {
            if (!file) {
                errorOccurance({
                    icon: 'database',
                    detail: 'File did not exist!'
                });
                return;
            }

            if (!file.hasOwnProperty('groups')) {
                errorOccurance({
                    icon: 'database',
                    detail: 'File did not contain any groups as a first level!'
                });
                return;
            }

            const groupsPool = this.createGroupsPool();

            file.groups.forEach(function (groupItem) {
                const group = new this.createGroup();
                const view = group.getGroupView();
                group.setGroupName(groupItem.name);
                view.setText(groupItem.name);
                view.appendTo(groupsPool.getView());
            }, this);
        }

        // setTimeout(() => {
        //     if (atom.config.get('project-viewer2.3LevelsDeep')) {
        //         process3Levels.call(this);
        //     } else {
        //         process2Levels.call(this);
        //     }
        // }, 1000);
        //
        // setTimeout(() => {
        //     DB.clientsPool.forEach((pool) => {
        //         pool.sortClientsChildren('alphabetic');
        //     });
        // }, 4000);
        //
        // setTimeout(() => {
        //     DB.groupsPool.forEach((pool) => {
        //         pool.sortGroupsChildren('alphabetic');
        //     });
        // }, 6000);
        //
        // setTimeout(() => {
        //     DB.projectsPool.forEach((pool) => {
        //         pool.sortProjectsChildren('alphabetic');
        //     });
        // }, 8000);
    }
};







let settings = {
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
    statusBar: null,
    statusBarTile: null,
    selectListView: null,
};

let pv = {
    config: {
        'startupVisibility': {
            description: 'Define if you want **project-viewer** to be visible on startup.',
            type: 'boolean',
            default: false,
            order: 0
        },
        'statusBarVisibility': {
            description: 'Define if you want **project-viewer** to show active *group* and *project*.',
            type: 'boolean',
            default: false,
            order: 1
        },
        'autohide': {
            description: 'Hability to autohide project viewer.',
            type: 'boolean',
            default: false,
            order: 2
        },
        'keepProjectState': {
            description: 'Set to false will not keep track of each project\´s **tree-view** folder state.',
            type: 'boolean',
            default: true,
            order: 3
        },
        '3LevelsDeep': {
            description: 'Set as a 3 level hierarchy (`Clients -> Groups -> Projects`) or only a 2 level (`Groups -> Projects`).',
            type: 'boolean',
            default: true,
            order: 4
        }
    },
    addModalAddClient: function addModalAddClient() {
        let modal = atom.workspace.addModalPanel({
            item: new addClientConstructor(),
            visible: true
        });
        this.disposables.add(modal);
        modal.getItem().focus();
    },
    removeModalAddClient: function removeModalAddClient() {
        this.disposables.add(atom.workspace.addModalPanel({
            item: new removeClientConstructor(),
            visible: true
        }));
    },
    addToStatusBar: function addToStatusBar() {
        let view;

        view = new statusBarConstructor();

        if (this.selectedProject) {
            view.setText(this.selectedProject.getProjectGroup().name
                .concat(' / ')
                .concat(this.selectedProject.getProject().name));
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
        this.statusBar = statusBar;

        if (atom.config.get('project-viewer2.startupVisibility') && atom.config.get('project-viewer2.statusBarVisibility')) {
            this.addToStatusBar();
        }
    },
    activate: function activate() {
        let project;

        this.disposables = new CompositeDisposable();

        process.nextTick(() => {
            this.ui();
            this.populate();

            atom.config.onDidChange('project-viewer2.statusBarVisibility', (status) => {
                if (status.newValue) {
                    this.addToStatusBar();
                } else {
                    this.removeToStatusBar();
                }
            });

            atom.config.observe('project-viewer2.autohide', (value) => {
                if (value) {
                    this.children.mainView.classList.add('autohide');
                } else {
                    this.children.mainView.classList.remove('autohide');
                }
            });

            this.disposables.add(
                atom.commands.add('atom-workspace', {
                    'project-viewer2:add-client': this.addModalAddClient.bind(this),
                    'project-viewer2:remove-client': this.removeModalAddClient.bind(this),
                    'project-viewer2:toggleDisplay': this.togglePanel.bind(this),
                    'project-viewer2:toggleFocus': this.toggleFocus.bind(this),
                    'project-viewer2:elevate-project': this.elevateToProject.bind(this)
                }
            ));

            project = this.searchProject({
                paths: atom.project.getPaths()
            });

            if (project && project.length === 1) {
                this.selectedProject = project[0];
                pv.selectedProject.getProject().view.classList.add('selected');
            }

            this.panel = atom.workspace.addRightPanel({
                item: this.children.mainView,
                visible: atom.config.get('project-viewer2.startupVisibility')
            });

            this.selectListView = new PVSelectListView();
        });
    },
    elevateToProject: function elevateToProject() {
        console.debug(atom.project.getPaths());
    },
    ui: function ui() {

        this.children = {};

        if (atom.workspace.paneForItem(this.children.mainView)) {
            atom.workspace.paneForItem(this.children.mainView).destroy();
        }

        this.children.mainView = new mainConstructor();
        this.children.topicView = new topicConstructor();
        this.children.clientsView = new clientsConstructor();
        this.children.statusInfoView = document.createElement('atom-panel');

        this.children.statusInfoView.appendChild(new statusInfoConstructor());

        this.children.topicView.appendTo(this.children.mainView);
        this.children.clientsView.appendTo(this.children.mainView);

        this.children.mainView.appendChild(this.children.statusInfoView);
    },
    serialize: function serialize() {},
    deactivate: function deactivate() {
        this.selectListView.cancel();
        this.statusBarTile.destroy();
        this.statusBarTile = null;
        this.panel.destroy();
        this.disposables.dispose();
    },
    populate: function populate() {
        this.storage.clients.forEach((clientStored) => {
            let client = Object.assign({
                client: {
                    name: '',
                    icon: '',
                    expanded: false,
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
                        expanded: false,
                        view: new groupConstructor()
                    }
                }, this.group_methods);
                group.setGroupName(groupStored.name);
                group.setGroupIcon(groupStored.icon);
                group.group.view.collapse();
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
                    project.project.view.setDataGroup(group.group.name);
                    project.project.view.setDataClient(client.client.name);
                    project.project.view.appendTo(projectsView);
                });
            });
        });
    },
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

        if (!pkg || !pkg.mainModule || !pkg.mainModule.treeView) {
            return;
        };

        return pkg.mainModule.treeView.serialize();
    },
    treeViewDeserialization: function treeViewDeserialization(serialization) {
        let pkg = atom.packages.getActivePackage('tree-view');

        if (!pkg || !serialization || !serialization.directoryExpansionStates) {
            return;
        }

        if (!pkg || !pkg.mainModule) {
            return;
        }

        if (!pkg.mainModule.treeView) {
            pkg.mainModule.treeView.createView(serialization.directoryExpansionStates);
        } else {
            pkg.mainModule.treeView.updateRoots(serialization.directoryExpansionStates);
        }
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
        closeState: function closeState() {
            let serializationFile = atom.getStateKey(
                this.getProject().paths
            );

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

            atom.workspace.destroyActivePane();

            pv.statusBarTile.getItem().setText('');
        },
        openState: function openState() {
            let serializationFile,
                serialization,
                project;

            project = this.getProject();

            serializationFile = atom.getStateKey(project.paths);

            if (serializationFile) {
                serialization = atom.storageFolder.load(serializationFile);
            }

            if (serialization) {
                pv.projectDeserialization(serialization.project);
                pv.workspaceDeserialization(serialization.workspace);
                pv.treeViewDeserialization(serialization.treeview);
            } else {
                atom.project.setPaths(project.paths);
            }

            pv.statusBarTile.getItem().setText(this.getProjectGroup().name
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
    newClient: function newClient(candidate) {
        let isNew = !this.db.clients.some(
            (client) => {
                return candidate.name === client.name;
            }
        );
        if ((isNew || !this.db.clients.length) && candidate.name) {
            return this.db.clients.push(Object.assign({
                client: {
                    name: candidate.name,
                    icon: candidate.icon || '',
                    expanded: candidate.expanded || false,
                    view: new clientConstructor()
                }
            }, this.client_methods));
        }
        return -1;
    },
    deleteClient: function deleteClient(candidate) {
        let client = this.db.clients.map(
            (clientListed, idx) => {
                let client = clientListed.getClient();
                if (candidate.name === client.name) {
                    return {
                        idx: idx,
                        client: client
                    }
                }
            }
        ).filter((clientMapped) => {
            return clientMapped !== undefined;
        });
        if (client.length === 1) {
            this.db.clients.splice(client[0].client.idx, 1);
        }
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
    },
    togglePanel: function togglePanel() {
        this.panel.visible ? this.panel.hide() : this.panel.show();
    },
    setFocus: function setFocus() {
        this.panel.getItem().focus();
    },
    toggleFocus: function toggleFocus() {
        if (document.activeElement === this.panel.getItem()) {
            atom.workspace.getActivePane().activate();
            this.downDisposable && this.downDisposable.dispose();
            this.upDisposable && this.upDisposable.dispose();
        } else {
            this.setFocus();
        }
    },
    moveUp: function moveUp(evt) {
        console.debug(evt);
        evt.stopPropagation();
    },
    moveDown: function moveDown(evt) {
        console.debug(evt);
        evt.stopPropagation();
    }
};

Object.setPrototypeOf(pv, settings);

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

        pv.storeDB();

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
