'use strict';

const _views = require('./views');
const _utilities = require('./utilities');
const _utils = require('./utils');

const definition = {
    custom: 'pv-remove-modal'
};

// TODO: this can be on the helper functions with an argument being the modal
function closeModal () {
    atom.workspace.panelForItem(this).destroy();
}

function addTopic () {
    const views = _views.get(this);

    views.topic = document.createElement('h1');
    views.topic.textContent = 'Choose what to remove:';

    this.appendChild(views.topic);
}

function removeButtonClickEvent (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    let clients = [];
    let groups = [];
    let projects = [];
    let clientIdx;
    let groupIdx;
    let projectIdx;
    let clientView;
    let groupView;
    let projectView;

    const model = _utilities.getDB().mapper.get(this);

    if (!_utilities.getDB().storage) {
        return;
    }

    if (model.client && _utilities.getDB().storage.clients) {
        clients = _utilities.getDB().storage.clients;
    }

    clients.some(
        (clientStored, idx) => {
            const foundClient = clientStored === model.client;

            if (foundClient) {
                clientIdx = idx;
            }
            return foundClient;
        }
    );

    if (clients[clientIdx] && clients[clientIdx].groups && model.group) {
        groups = clients[clientIdx].groups;
    }
    else if (model.group && _utilities.getDB().storage.groups) {
        groups = _utilities.getDB().storage.groups;
    }

    groups.some(
        (groupStored, idx) => {
            const foundGroup = groupStored === model.group;

            if (foundGroup) {
                groupIdx = idx;
            }
            return foundGroup;
        }
    );

    if (clients[clientIdx] && clients[clientIdx].projects && model.project) {
        projects = clients[clientIdx].projects;
    }
    else if (model.project && _utilities.getDB().storage.projects) {
        projects = _utilities.getDB().storage.projects;
    }

    projects.some(
        (projectStored, idx) => {
            const foundProject = projectStored === model.project;

            if (foundProject) {
                projectIdx = idx;
            }
            return foundProject;
        }
    );

    if (projects.length > 0 && typeof projectIdx === 'number')  {
        projectView = document.getElementById(projects[projectIdx].name);
    }
    else if (groups.length > 0 && typeof groupIdx === 'number')  {
        groupView = document.getElementById(groups[groupIdx].name);
    }
    else if (clients.length > 0 && typeof clientIdx === 'number')  {
        projectView = document.getElementById(clients[clientIdx].name);
    }

    if (projects[projectIdx] && projectView) {
        delete projects[projectIdx];
        projectView.remove();
    }

    else if (groups[groupIdx] && groupView) {
        delete groups[groupIdx];
        groupView.remove();
    }

    else if (clients[clientIdx] && clientView) {
        delete clients[clientIdx];
        clientView.remove();
    }

    _utilities.getDB().storage = _utilities.getDB().store();

    closeModal.call(this);
}

function addRemoveButton () {
    const views = _views.get(this);

    views.removeButton = document.createElement('div');
    views.removeButton.classList.add('inline-block');
    views.removeButtonText = document.createElement('button');
    views.removeButtonText.classList.add('btn', 'btn-sm', 'btn-warning');
    views.removeButtonText.textContent = 'remove';

    views.removeButton.addEventListener(
        'click',
        removeButtonClickEvent.bind(this),
        false
    );

    views.removeButton.appendChild(views.removeButtonText);
    this.appendChild(views.removeButton);
}

function addCancelButton () {
    const views = _views.get(this);

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
    this.appendChild(views.cancelButton);
}

function clientViewClickEvent (client, evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const model = _utilities.getDB().mapper.get(this);
    let view = evt.target;
    let selected = view.parentElement.querySelector('.btn-info');

    if (selected && selected !== view) {
        selected.classList.remove('btn-info');
    }

    if (selected && selected === view) {
        selected.classList.remove('btn-info');
        delete model.client;
    }

    if (!selected || selected !== view) {
        view.classList.add('btn-info');
        model.client = client;
        addListOfGroups.call(this, undefined, client.groups);
        addListOfProjects.call(this, undefined, client.projects);
    }
}

function addListOfClients (selected) {
    const views = _views.get(this);
    const clients = _utilities.getDB().storage.clients;

    if (!clients || !Array.isArray(clients)) {
        return;
    }

    if (views.clients) {
        views.clients.remove();
    }

    views.clients = document.createElement('div');
    views.clients.classList.add('block');

    let clientsDescription = document.createElement('p');
    clientsDescription.textContent = 'Choose a client:';
    views.clients.appendChild(clientsDescription);

    let clientsView = clients.map(
        (clientStored) => {
            let clientView = document.createElement('div');
            clientView.classList.add('pv-btn-clients', 'btn', 'btn-sm', 'inline-block-tight');
            clientView.textContent = clientStored.name;
            clientView.addEventListener(
                'click',
                clientViewClickEvent.bind(this, clientStored),
                false
            );
            views.clients.appendChild(clientView);
            return clientView;
        }
    );

    if (clientsView.length === 0) {
        return;
    }

    this.insertBefore(views.clients, views.removeButton);
}

function groupViewClickEvent (group, evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const model = _utilities.getDB().mapper.get(this);
    let view = evt.target;
    let selected = view.parentElement.querySelector('.btn-info');

    if (selected && selected !== view) {
        selected.classList.remove('btn-info');
    }

    if (selected && selected === view) {
        selected.classList.remove('btn-info');
        delete model.client;
    }

    if (!selected || selected !== view) {
        view.classList.add('btn-info');
        model.group = group;
        addListOfProjects.call(this, undefined, group.projects);
    }
}

function addListOfGroups (selected, list) {
    const views = _views.get(this);
    const groups = list || _utilities.getDB().storage.groups;

    if (!groups || !Array.isArray(groups)) {
        return;
    }

    if (views.groups) {
        views.groups.remove();
    }

    views.groups = document.createElement('div');
    views.groups.classList.add('block');

    let groupsDescription = document.createElement('p');
    groupsDescription.textContent = 'Choose a group:';
    views.groups.appendChild(groupsDescription);

    let groupsView = groups.map(
        (groupStored) => {
            let groupView = document.createElement('div');
            groupView.classList.add('pv-btn-clients', 'btn', 'btn-sm', 'inline-block-tight');
            groupView.textContent = groupStored.name;
            groupView.addEventListener(
                'click',
                groupViewClickEvent.bind(this, groupStored),
                false
            );
            if (selected === groupStored) {
                groupView.classList.add('btn-info');
            }
            views.groups.appendChild(groupView);
            return groupView;
        }
    );

    if (groupsView.length === 0) {
        return;
    }

    this.insertBefore(views.groups, views.removeButton);
}

function projectViewClickEvent (project, evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const model = _utilities.getDB().mapper.get(this);
    let view = evt.target;
    let selected = view.parentElement.querySelector('.btn-info');

    if (selected && selected !== view) {
        selected.classList.remove('btn-info');
    }

    if (selected && selected === view) {
        selected.classList.remove('btn-info');
        delete model.client;
    }

    if (!selected || selected !== view) {
        view.classList.add('btn-info');
        model.project = project;
    }
}

function addListOfProjects (selected, list) {
    const views = _views.get(this);
    const projects = list || _utilities.getDB().storage.projects;

    if (!projects || !Array.isArray(projects)) {
        return;
    }

    if (views.projects) {
        views.projects.remove();
    }

    views.projects = document.createElement('div');
    views.projects.classList.add('block');

    let projectsDescription = document.createElement('p');
    projectsDescription.textContent = 'Choose a project:';
    views.projects.appendChild(projectsDescription);

    let projectsView = projects.map(
        (projectStored) => {
            let projectView = document.createElement('div');
            projectView.classList.add('pv-btn-clients', 'btn', 'btn-sm', 'inline-block-tight');
            projectView.textContent = projectStored.name;
            projectView.addEventListener(
                'click',
                projectViewClickEvent.bind(this, projectStored),
                false
            );
            if (selected === projectStored) {
                projectView.classList.add('btn-info');
            }
            views.projects.appendChild(projectView);
            return projectView;
        }
    );

    if (projectsView.length === 0) {
        return;
    }

    this.insertBefore(views.projects, views.removeButton);
}

const htmlMethods = {
    createdCallback: function createdCallback() {
        _views.set(this, {});

        this.classList.add('block');
    },
    attachedCallback: function attachedCallback() {
        const views = _views.get(this);

        const model = _utilities.getDB().mapper.get(this);

        addTopic.call(this);
        addRemoveButton.call(this);
        addCancelButton.call(this);

        // TODO: validate the model conditions
        addListOfClients.call(this, model.client);
        addListOfGroups.call(this, model.group);
        addListOfProjects.call(this, model.project);
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    definition: definition,
    methods: htmlMethods
};
