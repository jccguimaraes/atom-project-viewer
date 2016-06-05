'use strict';

const _views = require('./views');
const _utilities = require('./utilities');
const _utils = require('./utils');

const definition = {
    custom: 'pv-remove-modal'
};

let originalItem = {};
let changesToItem = {};

// TODO: this can be on the helper functions with an argument being the modal
function closeModal () {
    changesToItem = {};
    atom.workspace.panelForItem(this).destroy();
}

function addTopic () {
    const views = _views.get(this);

    views.topic = document.createElement('h1');
    views.topic.textContent = 'Choose what to remove:';

    this.appendChild(views.topic);
}

function buttonClickEvent (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    _utilities.removeItem(originalItem)
    .then((data) => {
        closeModal.call(this);
        _utils.notification(data.type, data.message);
    })
    .catch((data) => {
        _utils.notification(data.type, data.message);
    });
}

function addButtons () {
    const views = _views.get(this);

    views.buttonsContainer = document.createElement('div');
    views.buttonsContainer.classList.add('block');

    views.actionButton = document.createElement('div');
    views.actionButton.classList.add('inline-block');
    views.actionButtonText = document.createElement('button');
    views.actionButtonText.classList.add('btn', 'btn-sm', 'btn-warning');
    views.actionButtonText.textContent = 'remove';

    views.actionButton.addEventListener(
        'click',
        buttonClickEvent.bind(this),
        false
    );

    views.actionButton.appendChild(views.actionButtonText);

    views.cancelButton = document.createElement('div');
    views.cancelButton.classList.add('inline-block');
    views.cancelButtonText = document.createElement('button');
    views.cancelButtonText.classList.add('btn', 'btn-sm');
    views.cancelButtonText.textContent = 'cancel';

    views.cancelButton.addEventListener('click', (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        closeModal.call(this);
    });

    views.cancelButton.appendChild(views.cancelButtonText);

    views.buttonsContainer.appendChild(views.actionButton);
    views.buttonsContainer.appendChild(views.cancelButton);

    this.appendChild(views.buttonsContainer);
}

function clientViewClickEvent (client, evt) {
    evt.stopPropagation();
    evt.preventDefault();

    let view = evt.target;
    let selected = view.parentElement.querySelector('.btn-info');

    changesToItem.hasGroup = false;

    if (selected && selected !== view) {
        selected.classList.remove('btn-info');
        changesToItem.hasClient = false;
        delete changesToItem.client;
    }
    else if (selected && selected === view) {
        selected.classList.remove('btn-info');
        changesToItem.hasClient = false;
        changesToItem.hasGroup = false;
        delete changesToItem.client;
        delete changesToItem.group;
        originalItem = {};
    }

    if (!selected || selected !== view) {
        view.classList.add('btn-info');
        changesToItem.hasClient = true;
        changesToItem.client = client;
        originalItem = client;
    }

    addListOfGroups.call(this);
    addListOfProjects.call(this);
}

function clearListOfClients () {
    const views = _views.get(this);
    if (views.clients) {
        views.clients.remove();
        delete views.clients;
    }
}

function addListOfClients () {
    const views = _views.get(this);
    const clients = _utilities.getDB().views.clients.map(
        (clientId) => {
            return _utilities.getDB().mapper.get(
                document.getElementById(clientId)
            );
        }
    ).filter(
        (client) => {
            if (!client) {
                return false;
            }
            return client;
        }
    );

    clearListOfClients.call(this);

    if (clients.length === 0) {
        return;
    }

    views.clients = document.createElement('div');
    views.clients.classList.add('inset-panel', 'padded');

    let clientsDescription = document.createElement('label');
    clientsDescription.classList.add('pv-label');
    clientsDescription.textContent = 'Select a client:';
    views.clients.appendChild(clientsDescription);

    let container = document.createElement('div');
    container.classList.add('block');
    views.clients.appendChild(container);

    let clientsView = clients.map(
        (clientStored) => {
            let clientView = document.createElement('div');
            clientView.classList.add('pv-btn-clients', 'btn', 'btn-sm', 'inline-block-tight');
            clientView.textContent = clientStored.clientName;
            clientView.addEventListener(
                'click',
                clientViewClickEvent.bind(this, clientStored),
                false
            );
            container.appendChild(clientView);
            if (originalItem.parent && originalItem.parent.clientId === clientStored.clientId) {
                clientView.classList.add('btn-info');
                changesToItem.hasClient = true;
                changesToItem.client = clientStored;
            } else if (originalItem.root && originalItem.root.clientId === clientStored.clientId) {
                clientView.classList.add('btn-info');
            }
            return clientView;
        }
    );

    if (clientsView.length === 0) {
        return;
    }

    this.insertBefore(views.clients, views.buttonsContainer);
}

function groupViewClickEvent (group, evt) {
    evt.stopPropagation();
    evt.preventDefault();

    let view = evt.target;
    let selected;

    if (view.parentElement) {
        selected = view.parentElement.querySelector('.btn-info');
    }

    if (selected && selected !== view) {
        selected.classList.remove('btn-info');
        changesToItem.hasGroup = false;
        delete changesToItem.group;
        originalItem = {};
    }

    if (selected && selected === view) {
        selected.classList.remove('btn-info');
        changesToItem.hasGroup = false;
        delete changesToItem.group;
        originalItem = {};
    }

    if (!selected || selected !== view) {
        view.classList.add('btn-info');
        changesToItem.hasGroup = true;
        changesToItem.group = group;
        changesToItem.hasClient = !!group.clientId;
        changesToItem.client = changesToItem.hasClient ? Object.getPrototypeOf(changesToItem.group) : undefined;
        originalItem = group;
        addListOfProjects.call(this);
    }
}

function clearListOfGroups () {
    const views = _views.get(this);
    if (views.groups) {
        views.groups.remove();
        delete views.groups;
    }
}

function addListOfGroups () {
    const views = _views.get(this);
    const groups = _utilities.getDB().views.groups.map(
        (groupId) => {
            return _utilities.getDB().mapper.get(
                document.getElementById(groupId)
            );
        }
    ).filter(
        (group) => {
            if (!group) {
                return false;
            }
            if (originalItem.current && originalItem.current.type !== 'project') {
                return;
            }
            if (
                !changesToItem.hasOwnProperty('hasClient')
                && originalItem.current && originalItem.current.clientId
            ) {
                return group.clientId === originalItem.current.clientId;
            }
            else if (
                changesToItem.hasOwnProperty('hasClient')
                && !changesToItem.hasClient
            ) {
                return !group.clientId;
            }
            else {
                return changesToItem.client ? group.clientId === changesToItem.client.clientId : !group.clientId;
            }
        }
    );

    clearListOfGroups.call(this);

    if (groups.length === 0) {
        return;
    }

    views.groups = document.createElement('div');
    views.groups.classList.add('inset-panel', 'padded');

    let groupsDescription = document.createElement('label');
    groupsDescription.classList.add('pv-label');
    groupsDescription.textContent = 'Select a group:';
    views.groups.appendChild(groupsDescription);

    let container = document.createElement('div');
    container.classList.add('block');
    views.groups.appendChild(container);

    let groupsView = groups.map(
        (groupStored) => {
            let groupView = document.createElement('div');
            groupView.classList.add('pv-btn-clients', 'btn', 'btn-sm', 'inline-block-tight');
            groupView.textContent = groupStored.groupName;
            groupView.addEventListener(
                'click',
                groupViewClickEvent.bind(this, groupStored),
                false
            );
            if (originalItem.parent && originalItem.parent.groupId === groupStored.groupId) {
                groupView.classList.add('btn-info');
            } else if (originalItem.root && originalItem.root.groupId === groupStored.groupId) {
                groupView.classList.add('btn-info');
            }
            container.appendChild(groupView);
            return groupView;
        }
    );

    if (groupsView.length === 0) {
        return;
    }

    this.insertBefore(views.groups, views.buttonsContainer);
}

function projectViewClickEvent (project, evt) {
    evt.stopPropagation();
    evt.preventDefault();

    let view = evt.target;
    let selected = view.parentElement.querySelector('.btn-info');

    if (selected && selected !== view) {
        selected.classList.remove('btn-info');
        originalItem = {};
    }

    if (selected && selected === view) {
        selected.classList.remove('btn-info');
        originalItem = {};
    }

    if (!selected || selected !== view) {
        view.classList.add('btn-info');
        originalItem = project;
    }
}

function clearListOfProjects () {
    const views = _views.get(this);
    if (views.projects) {
        views.projects.remove();
        delete views.projects;
    }
}

function addListOfProjects () {
    const views = _views.get(this);
    const projects = _utilities.getDB().views.projects.map(
        (projectId) => {
            return _utilities.getDB().mapper.get(
                document.getElementById(projectId)
            );
        }
    ).filter(
        (project) => {
            if (!project) {
                return false;
            }
            else if (
                changesToItem.hasOwnProperty('hasClient') && changesToItem.hasClient
                && !changesToItem.hasGroup
                && !project.groupId
            ) {
                return project.clientId === changesToItem.client.clientId;
            }
            else if (
                changesToItem.hasOwnProperty('hasGroup') && changesToItem.hasGroup
            ) {
                return project.groupId === changesToItem.group.groupId;
            }
            else if (
                (!changesToItem.hasOwnProperty('hasClient') || !changesToItem.hasClient)
                && (!changesToItem.hasOwnProperty('hasGroup') || !changesToItem.hasGroup)
                && !project.clientId
                && !project.groupId
            ) {
                return project;
            }
        }
    );

    clearListOfProjects.call(this);

    if (projects.length === 0) {
        return;
    }

    views.projects = document.createElement('div');
    views.projects.classList.add('inset-panel', 'padded');

    let projectsDescription = document.createElement('label');
    projectsDescription.classList.add('pv-label');
    projectsDescription.textContent = 'Select a project:';
    views.projects.appendChild(projectsDescription);

    let container = document.createElement('div');
    container.classList.add('block');
    views.projects.appendChild(container);

    let projectsView = projects.map(
        (projectStored) => {
            let projectView = document.createElement('div');
            projectView.classList.add('pv-btn-projects', 'btn', 'btn-sm', 'inline-block-tight');
            projectView.textContent = projectStored.projectName;
            projectView.addEventListener(
                'click',
                projectViewClickEvent.bind(this, projectStored),
                false
            );
            if (originalItem.parent && originalItem.parent.groupId === projectStored.groupId) {
                projectView.classList.add('btn-info');
            } else if (originalItem.root && originalItem.root.groupId === projectStored.groupId) {
                projectView.classList.add('btn-info');
            }
            container.appendChild(projectView);
            return projectView;
        }
    );

    if (projectsView.length === 0) {
        return;
    }

    this.insertBefore(views.projects, views.buttonsContainer);
}

const htmlMethods = {
    createdCallback: function createdCallback() {
        _views.set(this, {});

        this.classList.add('block');
    },
    attachedCallback: function attachedCallback() {
        const item = _utilities.getDB().mapper.get(this);

        if (!item) {
            closeModal.call(this);
        }

        originalItem = _utilities.getItemChain(item);

        addTopic.call(this);
        addListOfClients.call(this);
        addListOfGroups.call(this);
        addListOfProjects.call(this);
        addButtons.call(this);
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    definition: definition,
    methods: htmlMethods
};
