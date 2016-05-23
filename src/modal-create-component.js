'use strict';

const _views = require('./views');
const _utilities = require('./utilities');
const _utils = require('./utils');
const _octicons = require('./octicons');

const _listNestedItemComponent = require('./list-nested-item-component');
const _listItemComponent = require('./list-item-component');
const _listTreeComponent = require('./list-tree-component');

const definition = {
    custom: 'pv-create-modal'
};

// TODO: this can be on the helper functions with an argument being the modal
function closeModal () {
    atom.workspace.panelForItem(this).destroy();
}

function addTopic () {
    const views = _views.get(this);

    views.topic = document.createElement('h1');
    views.topic.textContent = 'Choose what to add:';

    this.appendChild(views.topic);
}

function addIconClickEvent (evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const selected = evt.target.parentElement.querySelector('.btn-info');
    const model = _utilities.getDB().mapper.get(this);
    const view = evt.target;

    if (selected && selected !== view) {
        selected.classList.remove('btn-info');
    }

    if (selected && selected === view) {
        selected.classList.remove('btn-info');
        delete model.icon;
    }

    if (!selected || selected !== view) {
        view.classList.add('btn-info');
        model.icon = view.textContent;
    }
}

function addIcons () {
    const views = _views.get(this);

    if (views.icons) {
        return;
    }

    views.icons = document.createElement('div');
    views.icons.classList.add('inset-panel', 'padded');

    let iconsDescription = document.createElement('label');
    iconsDescription.classList.add('pv-label');
    iconsDescription.textContent = 'Choose if it will have an icon:';

    let iconsList = document.createElement('div');
    iconsList.classList.add('inline-block', 'pv-icons');

    _octicons.icons.forEach(
        (icon) => {
            let entryIcon = document.createElement('button');
            entryIcon.classList.add('btn', 'btn-sm', 'inline-block-tight', 'text-subtle', 'icon', icon);
            entryIcon.textContent = icon;
            entryIcon.addEventListener('click', addIconClickEvent.bind(this), false);
            iconsList.appendChild(entryIcon);
        }
    );

    views.icons.appendChild(iconsDescription);
    views.icons.appendChild(iconsList);
    this.insertBefore(views.icons, views.buttonsContainer);
}

function clearPaths () {
    const views = _views.get(this);
    if (views.paths) {
        views.paths.remove();
        delete views.paths;
    }
}

function eachFolder (folder) {
    const views = _views.get(this);
    const model = _utilities.getDB().mapper.get(this);

    if (!model.paths && !Array.isArray(model.paths)) {
        model.paths = [];
    }

    if (model.paths.indexOf(folder) !== -1) {
        _utils.notification('warning', `The path <strong>${folder}</strong> was already added!`);
        return;
    }

    model.paths.push(folder);

    if (model.paths.length === 1 && views.itemInput.getModel().buffer.getText() === '') {
        let name = folder.split('/').reverse()[0];
        views.itemInput.getModel().buffer.setText(name);
    }

    let pathViewIcon = document.createElement('span');
    pathViewIcon.classList.add('icon', 'icon-remove-close', 'status-removed');
    pathViewIcon.addEventListener('click', removePath.bind(this), false);

    let pathViewText = document.createElement('span');
    pathViewText.textContent = folder;

    let pathView = document.createElement('li');
    pathView.classList.add('list-item', 'text-subtle');

    pathView.appendChild(pathViewIcon);
    pathView.appendChild(pathViewText);
    views.pathsList.appendChild(pathView);
}

function addPath (evt) {
    evt.preventDefault();
    evt.stopPropagation();

    atom.pickFolder((folders) => {
        if (!Array.isArray(folders)) {
            return;
        }
        folders.forEach(eachFolder.bind(this));
    });
}

function removePath (evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const model = _utilities.getDB().mapper.get(this);

    if (model.paths && Array.isArray(model.paths)) {

        const idx = model.paths.indexOf(evt.target.nextSibling.textContent);

        if (idx !== -1) {
            model.paths.splice(idx, 1);
            evt.target.parentElement.remove();
        }
    }
}

function addPaths () {
    const views = _views.get(this);

    if (views.paths) {
        return;
    }

    views.paths = document.createElement('div');
    views.paths.classList.add('inset-panel', 'padded');

    views.pathsContainer = document.createElement('div');
    views.pathsContainer.classList.add('block');

    views.pathsList = document.createElement('ul');
    views.pathsList.classList.add('list-group', 'pv-list-group');

    views.pathAdd = document.createElement('button');
    views.pathAdd.classList.add('inline-block', 'btn', 'btn-warning', 'btn-xs', 'icon', 'icon-file-add');
    views.pathAdd.textContent = 'Add root paths:';
    views.pathAdd.addEventListener('click', addPath.bind(this), false);

    views.paths.appendChild(views.pathAdd);
    views.paths.appendChild(views.pathsList);
    views.paths.appendChild(views.pathsContainer);

    this.insertBefore(views.paths, views.buttonsContainer);
}

function addChoiceClickEvent (evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const current = evt.target.parentElement.querySelector('.selected');
    const model = _utilities.getDB().mapper.get(this);

    if (evt.target === current) {
        return;
    }

    if (current) {
        current.classList.remove('selected');
    }

    evt.target.classList.add('selected');

    let type = evt.target.textContent.toLowerCase();

    if (type === 'client') {
        model.type = 'client';
        clearListOfClients.call(this);
        clearListOfGroups.call(this);
        clearPaths.call(this);
        addItemInput.call(this);
        addIcons.call(this);
    }
    else if (type === 'group') {
        model.type = 'group';
        clearListOfGroups.call(this);
        clearPaths.call(this);
        addItemInput.call(this);
        addIcons.call(this);
        addListOfClients.call(this);
    }

    else if (type === 'project') {
        model.type = 'project';
        addItemInput.call(this);
        addIcons.call(this);
        addPaths.call(this);
        addListOfClients.call(this);
        addListOfGroups.call(this);
    }
}

function addChoice () {
    const views = _views.get(this);

    views.choiceOptions = document.createElement('div');
    views.choiceOptions.classList.add('block', 'btn-group', 'btn-group-xs');

    views.choiseClient = document.createElement('button');
    views.choiseClient.classList.add('btn');
    views.choiseClient.textContent = 'Client';
    views.choiseClient.addEventListener('click', addChoiceClickEvent.bind(this), false);

    views.choiseGroup = document.createElement('button');
    views.choiseGroup.classList.add('btn');
    views.choiseGroup.textContent = 'Group';
    views.choiseGroup.addEventListener('click', addChoiceClickEvent.bind(this), false);

    views.choiseProject = document.createElement('button');
    views.choiseProject.classList.add('btn');
    views.choiseProject.textContent = 'Project';
    views.choiseProject.addEventListener('click', addChoiceClickEvent.bind(this), false);

    views.choiceOptions.appendChild(views.choiseClient);
    views.choiceOptions.appendChild(views.choiseGroup);
    views.choiceOptions.appendChild(views.choiseProject);

    this.appendChild(views.choiceOptions);
}

function createButtonClickEvent (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    let name;
    let listNestedItemConstructor = _utilities.getConstructor(_listNestedItemComponent.definition);
    let listItemConstructor = _utilities.getConstructor(_listItemComponent.definition);
    let listTreeConstructor = _utilities.getConstructor(_listTreeComponent.definition);
    let view;

    const views = _views.get(this);
    const model = _utilities.getDB().mapper.get(this);

    if (views.itemInput) {
        name = _utils.sanitizeString(views.itemInput.getModel().buffer.getText());
    }

    if (model.type === 'project') {
        view = new listItemConstructor();
    } else {
        view = new listNestedItemConstructor();
        view.addNode(new listTreeConstructor());
    }

    model.view = view;
    model.name = _utils.sanitizeString(name);

    _utilities.createItem(model)
    .then((data) => {
        _utils.notification(data.type, data.message);
        closeModal.call(this);
    })
    .catch((data) => {
        _utils.notification(data.type, data.message);
    });
}

function addItemInput () {
    const views = _views.get(this);

    if (views.itemContainer) {
        return;
    }

    views.itemContainer = document.createElement('div');
    views.itemContainer.classList.add('inset-panel', 'padded');

    views.inputDescription = document.createElement('label');
    views.inputDescription.classList.add('pv-label');
    views.inputDescription.textContent = 'Choose a name:';
    views.itemInput = document.createElement('atom-text-editor');
    views.itemInput.setAttribute('mini', true);

    views.itemContainer.appendChild(views.inputDescription);
    views.itemContainer.appendChild(views.itemInput);

    this.insertBefore(views.itemContainer, views.buttonsContainer);
}

function addButtons () {
    const views = _views.get(this);

    views.buttonsContainer = document.createElement('div');
    views.buttonsContainer.classList.add('block');

    views.createButton = document.createElement('div');
    views.createButton.classList.add('inline-block');
    views.createButtonText = document.createElement('button');
    views.createButtonText.classList.add('btn', 'btn-sm', 'btn-success');
    views.createButtonText.textContent = 'create';

    views.createButton.addEventListener(
        'click',
        createButtonClickEvent.bind(this),
        false
    );

    views.createButton.appendChild(views.createButtonText);

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

    views.buttonsContainer.appendChild(views.createButton);
    views.buttonsContainer.appendChild(views.cancelButton);

    this.appendChild(views.buttonsContainer);
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
        selected = view;
    }

    if (model && model.client && model.type === 'project') {
        addListOfGroups.call(this, undefined, model.client.groups);
    }
}

function clearListOfClients () {
    const views = _views.get(this);
    if (views.clients) {
        views.clients.remove();
        delete views.clients;
    }
}

function addListOfClients (selected) {
    const views = _views.get(this);
    const clients = _utilities.getDB().storage.clients;

    clearListOfClients.call(this);

    if (!clients || !Array.isArray(clients)) {
        return;
    }

    views.clients = document.createElement('div');
    views.clients.classList.add('inset-panel', 'padded');

    let clientsDescription = document.createElement('label');
    clientsDescription.classList.add('pv-label');
    clientsDescription.textContent = 'Choose if it will belong to the following client:';
    views.clients.appendChild(clientsDescription);

    let container = document.createElement('div');
    container.classList.add('block');
    views.clients.appendChild(container);

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
            container.appendChild(clientView);
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
    }
}

function clearListOfGroups () {
    const views = _views.get(this);
    if (views.groups) {
        views.groups.remove();
        delete views.groups;
    }
}

function addListOfGroups (selected, list) {
    const views = _views.get(this);
    const groups = list || _utilities.getDB().storage.groups;

    clearListOfGroups.call(this);

    if (!groups || !Array.isArray(groups)) {
        return;
    }

    views.groups = document.createElement('div');
    views.groups.classList.add('inset-panel', 'padded');

    let groupsDescription = document.createElement('label');
    groupsDescription.classList.add('pv-label');
    groupsDescription.textContent = 'Choose if it will belong to the following group:';
    views.groups.appendChild(groupsDescription);

    let container = document.createElement('div');
    container.classList.add('block');
    views.groups.appendChild(container);

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
            container.appendChild(groupView);
            return groupView;
        }
    );

    if (groupsView.length === 0) {
        return;
    }

    this.insertBefore(views.groups, views.buttonsContainer);
}

const htmlMethods = {
    createdCallback: function createdCallback () {
        _views.set(this, {});

        this.classList.add('block');
    },
    attachedCallback: function attachedCallback () {
        const views = _views.get(this);

        const model = _utilities.getDB().mapper.get(this);

        addTopic.call(this);
        addChoice.call(this);

        addButtons.call(this);
    },
    detachedCallback: function detachedCallback () {
        const views = _views.get(this);

        // entryIcon.removeEventListener('click', addIconClickEvent.bind(this));
        // pathViewIcon.removeEventListener('click', removePath.bind(this));
        views.pathAdd && views.pathAdd.removeEventListener('click', addPath.bind(this));
        views.choiseClient && views.choiseClient.removeEventListener('click', addChoiceClickEvent.bind(this));
        views.choiseGroup && views.choiseGroup.removeEventListener('click', addChoiceClickEvent.bind(this));
        views.choiseProject && views.choiseProject.removeEventListener('click', addChoiceClickEvent.bind(this));
        views.createButton && views.createButton.removeEventListener('click', createButtonClickEvent.bind(this));
        // views.cancelButton.removeEventListener('click', (evt) => {
        //     evt.stopPropagation();
        //     evt.preventDefault();
        //
        //     closeModal.call(this);
        // });
        // clientView.removeEventListener('click', clientViewClickEvent.bind(this, clientStored));
        // groupView.removeEventListener('click', groupViewClickEvent.bind(this, groupStored));
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    definition: definition,
    methods: htmlMethods
};
