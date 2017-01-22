'use strict';

const CompositeDisposable = require('atom').CompositeDisposable;
const Path = require('path');

const _views = require('./views');
const _utilities = require('./utilities');
const _utils = require('./utils');
const _octicons = require('./octicons');
const _devicons = require('./devicons');

const _listItemComponent = require('./list-item-component');
const _listNestedItemComponent = require('./list-nested-item-component');
const _listTreeComponent = require('./list-tree-component');

const definition = {
    custom: 'pv-create-modal'
};

let originalItem = {};
let changesToItem = {};
let disposables;

// TODO: this can be on the helper functions with an argument being the modal
function closeModal () {
    changesToItem = {};
    atom.workspace.panelForItem(this).destroy();
}

function addHeading () {
    const views = _views.get(this);

    views.heading = document.createElement('h1');
    views.heading.innerHTML = `Set a new item`;

    this.appendChild(views.heading);
}

function addIconClickEvent (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const selected = evt.target.parentElement.querySelector('.btn-info');
    const model = _utilities.getDB().mapper.get(this);
    const view = evt.target;

    if (selected && selected !== view) {
        selected.classList.remove('btn-info');
        changesToItem.hasIcon = false;
        delete changesToItem.icon;
    }

    if (selected && selected === view) {
        selected.classList.remove('btn-info');
        changesToItem.hasIcon = false;
        delete changesToItem.icon;
    }

    if (!selected || selected !== view) {
        view.classList.add('btn-info');
        changesToItem.hasIcon = true;
        changesToItem.icon = view.getAttribute('data-icon');
    }
}

function clearExtras () {
    const views = _views.get(this);
    if (views.extrasContainer) {
        views.extrasContainer.remove();
        delete views.extrasContainer;
    }
}

function addExtras () {

    const views = _views.get(this);

    clearExtras.call(this);

    if (views.extrasContainer) {
        return;
    }

    const classToggle = 'text-success';

    views.extrasContainer = document.createElement('div');
    views.extrasContainer.classList.add('inset-panel', 'padded');

    if (!originalItem.current || originalItem.current.type === 'project') {
      views.devContainer = document.createElement('div');
      views.devContainer.classList.add('block');

      views.devCheck = document.createElement('span');
      views.devCheck.classList.add('icon', 'icon-check', 'inline-block-tight');
      views.devCheck.style.cursor = 'pointer';
      views.devCheck.addEventListener('click', (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        const views = _views.get(this);

        views.devCheck.classList.toggle('text-success');

        if (!changesToItem.hasOwnProperty('hasDev')) {
            changesToItem.hasDev = views.devCheck.classList.contains('text-success');
        }
        else {
            changesToItem.hasDev = !changesToItem.hasDev;
        }
      }, false);

      views.devDescription = document.createElement('span');
      views.devDescription.classList.add('inline-block-tight');
      views.devDescription.textContent = 'dev mode';

      let itemDev;

      if (originalItem && originalItem.current && originalItem.current.type) {
        itemDev = originalItem.current[originalItem.current.type + 'Dev'];
      }

      if (itemDev) {
        views.devCheck.classList.add('text-success');
      }

      views.devContainer.appendChild(views.devCheck);
      views.devContainer.appendChild(views.devDescription);
      views.extrasContainer.appendChild(views.devContainer);
    }
    else {
      views.colorCheck = document.createElement('span');
      views.colorCheck.classList.add('icon', 'icon-check', 'inline-block-tight');
      views.colorCheck.style.cursor = 'pointer';
      views.colorCheck.addEventListener('click', (evt) => {
          evt.stopPropagation();
          evt.preventDefault();

          views.colorCheck.classList.toggle(classToggle);

          if (!changesToItem.hasOwnProperty('hasColor')) {
              changesToItem.hasColor = views.colorCheck.classList.contains(classToggle);
          }
          else {
              changesToItem.hasColor = !changesToItem.hasColor;
          }

          if (changesToItem.hasColor) {
              changesToItem.color = views.colorInput.value;
          }
          else {
              views.colorInput.value = '#000000';
              delete changesToItem.color;
          }
      }, false);

      views.colorDescription = document.createElement('span');
      views.colorDescription.classList.add('inline-block-tight');
      views.colorDescription.textContent = 'set color';

      views.colorInput = document.createElement('input');
      views.colorInput.setAttribute('type', 'color');
      views.colorInput.addEventListener('change', (evt) => {
          evt.stopPropagation();
          evt.preventDefault();

          if (!changesToItem.hasColor) {
              changesToItem.hasColor = true;
          }
          changesToItem.color = views.colorInput.value;
          views.colorCheck.classList.add(classToggle);
      }, false);

      const itemColor = originalItem.current[originalItem.current.type + 'Color'];

      if (itemColor) {
          views.colorInput.value = itemColor;
          views.colorCheck.classList.add(classToggle);
      }

      views.extrasContainer.appendChild(views.colorCheck);
      views.extrasContainer.appendChild(views.colorDescription);
      views.extrasContainer.appendChild(views.colorInput);
    }

    this.insertBefore(views.extrasContainer, views.buttonsContainer);
}

function addIcons () {

    if (!originalItem.current) {
        return;
    }

    const views = _views.get(this);

    const itemIcon = originalItem.current[originalItem.current.type + 'Icon'];

    if (views.icons) {
        return;
    }

    views.icons = document.createElement('div');
    views.icons.classList.add('inset-panel', 'padded');

    let iconsListDescription = document.createElement('label');
    iconsListDescription.classList.add('pv-label');
    iconsListDescription.textContent = 'Select an icon:';

    let iconsList = document.createElement('div');
    iconsList.classList.add('inline-block', 'pv-icons');

    let iconsFilterDescription = document.createElement('label');
    iconsFilterDescription.classList.add('pv-label');
    iconsFilterDescription.textContent = 'Filter:';

    let iconsFilter = document.createElement('atom-text-editor');
    iconsFilter.setAttribute('mini', true);
    iconsFilter.addEventListener(
        'keyup',
        sortIcons.bind(this),
        false
    );

    loopIcons.call(this, _octicons, iconsList, itemIcon);
    loopIcons.call(this, _devicons, iconsList, itemIcon);

    views.icons.appendChild(iconsListDescription);
    views.icons.appendChild(iconsList);
    this.insertBefore(views.icons, views.buttonsContainer);
    views.icons.appendChild(iconsFilterDescription);
    views.icons.appendChild(iconsFilter);
}

function sortIcons (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const view = evt.target;
    const filterString = view.getModel().buffer.getText();
    const iconList = document.getElementsByClassName("pv-icons")[0];
    // Children are not of type array, so we convert them
    const iconListArry = [].slice.call(iconList.children);

    iconListArry.forEach(
        (child) => {
            const dataIcon = child.getAttribute('data-icon');
            // Remove the icon prefix for filter purpose
            const iconString = dataIcon.substring(dataIcon.indexOf('-')+1, dataIcon.length);
            if(iconString.indexOf(filterString) > -1){
                child.style.display = 'inline-block';
            } else {
                child.style.display = 'none';
            }
        }
    );
}

function loopIcons (iconSet, iconsList, itemIcon) {
    const smaller = atom.config.get('project-viewer.onlyIcons');
    iconSet.icons.forEach(
        (icon) => {
            let entryIcon = document.createElement('button');
            entryIcon.classList.add('btn', 'btn-sm', 'inline-block-tight', 'text-subtle', 'icon', icon);
            if (smaller) {
              entryIcon.classList.add('only-icon');
              disposables.add(
                atom.tooltips.add(entryIcon, {
                  title: icon,
                  delay: {show: 100, hide: 100}
                })
              );
            }
            else {
              entryIcon.textContent = icon;
            }
            entryIcon.setAttribute('data-icon', icon);
            entryIcon.addEventListener('click', addIconClickEvent.bind(this), false);
            iconsList.appendChild(entryIcon);
            if (itemIcon === icon) {
                entryIcon.classList.add('btn-info');
            }
        }
    );
}

function clearPaths () {
    const views = _views.get(this);
    if (views.paths) {
        views.paths.remove();
        delete views.paths;
    }
}

function eachFolder (evt, folder) {
    const views = _views.get(this);

    if (!changesToItem.paths) {
        changesToItem.paths = [];
    }

    // Because we are dispatching the event ourselves
    if (evt && evt.isTrusted && changesToItem.paths.indexOf(folder) !== -1) {
        _utils.notification('warning', `The path <strong>${folder}</strong> was already added!`);
        return;
    }

    if (evt && evt.isTrusted) {
        changesToItem.paths.push(folder);
    }

    if (changesToItem.paths.length === 1 && views.itemInput.getModel().buffer.getText() === '') {
        let name = Path.basename(folder);
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
    evt.stopPropagation();
    evt.preventDefault();

    atom.pickFolder((folders) => {
        if (!Array.isArray(folders)) {
            return;
        }
        folders.forEach(eachFolder.bind(this, evt));
    });
}

function addTreeView (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    let folders = atom.project.getPaths();
    folders.forEach(eachFolder.bind(this, evt));
}

function removePath (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    if (changesToItem.paths && Array.isArray(changesToItem.paths)) {

        const idx = changesToItem.paths.indexOf(evt.target.nextSibling.textContent);

        if (idx !== -1) {
            changesToItem.paths.splice(idx, 1);
            evt.target.parentElement.remove();
        }
    }
}

function addPaths (evt) {
    const views = _views.get(this);

    clearPaths.call(this);

    if (!originalItem.current || originalItem.current.type !== 'project') {
        return;
    }

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
    views.pathAdd.textContent = 'Add root paths:'
    views.pathAdd.addEventListener('click', addPath.bind(this), false);

    views.pathAddAuto = document.createElement('button');
    views.pathAddAuto.classList.add('inline-block', 'btn', 'btn-warning', 'btn-xs', 'icon', 'icon-file-add');
    views.pathAddAuto.textContent = 'Add tree view root folders'
    views.pathAddAuto.addEventListener('click', addTreeView.bind(this), false);

    if (originalItem.current && originalItem.current.projectPaths && Array.isArray(originalItem.current.projectPaths)) {
        changesToItem.paths = originalItem.current.projectPaths;
        originalItem.current.projectPaths.forEach(eachFolder.bind(this, evt));
    }

    views.paths.appendChild(views.pathAdd);
    views.paths.appendChild(views.pathAddAuto);
    views.paths.appendChild(views.pathsList);
    views.paths.appendChild(views.pathsContainer);

    this.insertBefore(views.paths, views.buttonsContainer);
}

function addChoiceClickEvent (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const current = evt.target.parentElement.querySelector('.selected');

    if (evt.target === current) {
        return;
    }

    if (current) {
        current.classList.remove('selected');
    }

    evt.target.classList.add('selected');

    originalItem.current = {
        type: evt.target.textContent.toLowerCase()
    };

    addIcons.call(this);
    addPaths.call(this);
    addExtras.call(this);
    addListOfClients.call(this);
    addListOfGroups.call(this);
}

function addChoice (model) {

    if (originalItem.current) {
        return;
    }

    const views = _views.get(this);

    views.choiceOptions = document.createElement('div');
    views.choiceOptions.classList.add('block', 'btn-group', 'btn-group-xs');

    views.choiceClient = document.createElement('button');
    views.choiceClient.classList.add('btn');
    views.choiceClient.textContent = 'Client';
    views.choiceClient.addEventListener('click', addChoiceClickEvent.bind(this), false);

    views.choiceGroup = document.createElement('button');
    views.choiceGroup.classList.add('btn');
    views.choiceGroup.textContent = 'Group';
    views.choiceGroup.addEventListener('click', addChoiceClickEvent.bind(this), false);

    views.choiceProject = document.createElement('button');
    views.choiceProject.classList.add('btn');
    views.choiceProject.textContent = 'Project';
    views.choiceProject.addEventListener('click', addChoiceClickEvent.bind(this), false);

    views.choiceOptions.appendChild(views.choiceClient);
    views.choiceOptions.appendChild(views.choiceGroup);
    views.choiceOptions.appendChild(views.choiceProject);

    this.appendChild(views.choiceOptions);
}

function buttonClickEvent (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    if (!originalItem.current) {
        return;
    }

    const views = _views.get(this);

    let inputText;

    if (views.itemInput) {
        inputText = views.itemInput.getModel().buffer.getText();
    }

    // if (inputText !== originalItem.current[originalItem.current.type + 'Name']) {
        changesToItem.name = inputText;
    // } else {
        // delete changesToItem.name;
    // }

    if (originalItem.current && originalItem.current.type === 'project') {
        let listItemConstructor = _utilities.getConstructor(_listItemComponent.definition);
        changesToItem.view = new listItemConstructor();
    } else {
        let listTreeConstructor = _utilities.getConstructor(_listTreeComponent.definition);
        let listNestedItemConstructor = _utilities.getConstructor(_listNestedItemComponent.definition);
        changesToItem.view = new listNestedItemConstructor();
        changesToItem.view.addNode(new listTreeConstructor());
    }

    _utilities.createItem(originalItem, changesToItem)
    .then((data) => {
        closeModal.call(this);
        _utils.notification(data.type, data.message);
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
    views.inputDescription.textContent = 'Set a new name:';
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

    views.updateButton = document.createElement('div');
    views.updateButton.classList.add('inline-block');
    views.updateButtonText = document.createElement('button');
    views.updateButtonText.classList.add('btn', 'btn-sm', 'btn-success');
    views.updateButtonText.textContent = 'create';

    views.updateButton.addEventListener(
        'click',
        buttonClickEvent.bind(this),
        false
    );

    views.updateButton.appendChild(views.updateButtonText);

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

    views.buttonsContainer.appendChild(views.updateButton);
    views.buttonsContainer.appendChild(views.cancelButton);

    this.appendChild(views.buttonsContainer);
}

function clientViewClickEvent (client, evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const model = _utilities.getDB().mapper.get(this);
    let view = evt.target;
    let selected = view.parentElement.querySelector('.btn-info');

    changesToItem.hasGroup = false;

    if (selected && selected !== view) {
        selected.classList.remove('btn-info');
        changesToItem.hasClient = true;
        changesToItem.client = client;
    }
    else if (selected && selected === view) {
        selected.classList.remove('btn-info');
        changesToItem.hasClient = false;
        changesToItem.hasGroup = false;
        delete changesToItem.client;
        delete changesToItem.group;
    }

    if (!selected || selected !== view) {
        view.classList.add('btn-info');
        changesToItem.hasClient = true;
        changesToItem.client = client;
    }

    addListOfGroups.call(this);
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
            if (!originalItem.current || (originalItem.current && originalItem.current.type === 'client')) {
                return;
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
    clientsDescription.textContent = 'Set client:';
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

    const model = _utilities.getDB().mapper.get(this);
    let view = evt.target;
    let selected;

    if (view.parentElement) {
        selected = view.parentElement.querySelector('.btn-info');
    }

    if (selected && selected !== view) {
        selected.classList.remove('btn-info');
        changesToItem.hasGroup = true;
        changesToItem.group = group;
    }

    if (selected && selected === view) {
        selected.classList.remove('btn-info');
        changesToItem.hasGroup = false;
        delete changesToItem.group;
    }

    if (!selected || selected !== view) {
        view.classList.add('btn-info');
        changesToItem.hasGroup = true;
        changesToItem.group = group;
        changesToItem.hasClient = !!group.clientId;
        changesToItem.client = changesToItem.hasClient ? Object.getPrototypeOf(changesToItem.group) : undefined;
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
    groupsDescription.textContent = 'Set group:';
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
                changesToItem.hasGroup = true;
                changesToItem.group = groupStored;
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

const htmlMethods = {
    createdCallback: function createdCallback() {
        _views.set(this, {});

        this.classList.add('block');

    },
    attachedCallback: function attachedCallback() {
        const item = _utilities.getDB().mapper.get(this);
        disposables = new CompositeDisposable();
        if (!item) {
            closeModal.call(this);
        }

        originalItem = _utilities.getItemChain(item);

        addHeading.call(this);
        addChoice.call(this);
        addItemInput.call(this);
        addIcons.call(this);
        addPaths.call(this);
        addExtras.call(this);
        addListOfClients.call(this);
        addListOfGroups.call(this);
        addButtons.call(this);
    },
    detachedCallback: function detachedCallback () {
        disposables.dispose();
        const views = _views.get(this);
        views.pathAdd && views.pathAdd.removeEventListener('click', addPath.bind(this));

        views.choiceClient && views.choiceClient.removeEventListener('click', addChoiceClickEvent.bind(this));
        views.choiceGroup && views.choiceGroup.removeEventListener('click', addChoiceClickEvent.bind(this));
        views.choiceProject && views.choiceProject.removeEventListener('click', addChoiceClickEvent.bind(this));
        views.updateButton && views.updateButton.removeEventListener('click', buttonClickEvent.bind(this));
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    definition: definition,
    methods: htmlMethods
};
