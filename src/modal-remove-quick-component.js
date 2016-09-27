'use strict';

const _views = require('./views');
const _utilities = require('./utilities');
const _utils = require('./utils');

const definition = {
    custom: 'pv-remove-quick-modal'
};

// TODO: this can be on the helper functions with an argument being the modal
function closeModal () {
    atom.workspace.panelForItem(this).destroy();
}

function addTopic () {
    const views = _views.get(this);

    views.topic = document.createElement('h1');
    views.topic.textContent = 'Please confirm this action:';

    this.appendChild(views.topic);
}

function removeButtonClickEvent (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const model = _utilities.getDB().mapper.get(this);

    if (model.project && model.projectView) {
        delete model.project;
        // atom.devMode = false;
        model.projectView.remove();
    }

    else if (model.group && model.groupView) {
        delete model.group;
        model.groupView.remove();
    }

    else if (model.client && model.clientView) {
        delete model.client;
        model.clientView.remove();
    }

    _utilities.getDB().store();

    _utilities.setSelectedProjectView();

    closeModal.call(this);
}

function addItemToRemove () {
    const views = _views.get(this);
    const model = _utilities.getDB().mapper.get(this);
    let text = '';

    views.itemPath = document.createElement('div');
    views.itemPath.classList.add('block');

    views.itemDescription = document.createElement('span');
    views.itemDescription.classList.add('block');
    views.itemDescription.innerHTML = `
        You are about to remove the following ${model.type}.
        <br>
        Keep in mind that any inside will also be removed.
    `;

    views.itemToRemove = document.createElement('span');
    views.itemToRemove.classList.add('inline-block', 'highlight');

    if (model.client) {
        text += model.client.clientName;
    }

    if (model.group) {
        text += ' / ' + model.group.groupName;
    }

    if (model.project) {
        text += ' / ' + model.project.projectName;
    }

    if (text.endsWith(' / ')) {
        text = text.slice(0, -3);
    }

    if (text.startsWith(' / ')) {
        text = text.slice(3);
    }

    views.itemToRemove.textContent = text;

    views.itemPath.appendChild(views.itemToRemove);
    this.appendChild(views.itemDescription);
    this.appendChild(views.itemPath);
}

function addSeparator () {
    const views = _views.get(this);

    views.separator = document.createElement('hr');

    this.appendChild(views.separator);
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

const htmlMethods = {
    createdCallback: function createdCallback() {
        _views.set(this, {});

        this.classList.add('block');
    },
    attachedCallback: function attachedCallback() {
        const views = _views.get(this);

        addTopic.call(this);
        addItemToRemove.call(this);
        addSeparator.call(this);
        addRemoveButton.call(this);
        addCancelButton.call(this);
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    definition: definition,
    methods: htmlMethods
};
