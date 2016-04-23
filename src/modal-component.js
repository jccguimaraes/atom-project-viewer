;'use strict';

const _utils = require('./utils');
const _utility = require('./utilities');
const _listNestedItemComponent = require('./list-nested-item-component');

const definition = {
    custom: 'pv-modal'
};

const viewNodes = new WeakMap();

const htmlMethods = {
    createdCallback: function createdCallback() {
        let nodes = {};

        nodes.topic = document.createElement('h1');
        nodes.topic.classList.add('block');
        nodes.topic.textContent = 'Add a new client';

        nodes.inputName = document.createElement('atom-text-editor');
        nodes.inputName.setAttribute('mini', true);

        nodes.error = document.createElement('div');
        nodes.error.classList.add('block', 'error-message');
        nodes.error.textContent = 'add a new client!';

        nodes.save = document.createElement('div');
        nodes.save.classList.add('inline-block');
        nodes.saveText = document.createElement('button');
        nodes.saveText.classList.add('btn', 'btn-primary');
        nodes.saveText.textContent = 'add';
        nodes.save.addEventListener('click', () => {
            let name = viewNodes.get(this).inputName.getModel().buffer.getText();

            let candidate = {
                viewConstructor: _utility.getConstructor(_listNestedItemComponent.definition),
                name: name
            };

            _utility.createClient(candidate)
            .then((data) => {
                _utils.notification(data.type, data.message);
            //     // atom.workspace.panelForItem(this).destroy();
            })
            .catch((data) => {
                _utils.notification(data.type, data.message);
            });
        });

        nodes.cancel = document.createElement('div');
        nodes.cancel.classList.add('inline-block');
        nodes.cancelText = document.createElement('button');
        nodes.cancelText.classList.add('btn');
        nodes.cancelText.textContent = 'cancel';
        nodes.cancel.addEventListener('click', () => {
            atom.workspace.panelForItem(this).destroy();
        });

        nodes.save.appendChild(nodes.saveText);
        nodes.cancel.appendChild(nodes.cancelText);

        nodes.chooseBlock = document.createElement('div');
        nodes.chooseBlock.classList.add('block');
        nodes.chooseBlockDescription = document.createElement('div');
        nodes.chooseBlockDescription.textContent = 'Choose what to add:';

        nodes.chooseBlockOptions = document.createElement('div');
        nodes.chooseBlockOptions.classList.add('btn-group', 'btn-group-xs');

        nodes.chooseBlockClient = document.createElement('button');
        nodes.chooseBlockClient.classList.add('btn');
        nodes.chooseBlockClient.textContent = 'Client';
        nodes.chooseBlockGroup = document.createElement('button');
        nodes.chooseBlockGroup.classList.add('btn');
        nodes.chooseBlockGroup.textContent = 'Group';
        nodes.chooseBlockProject = document.createElement('button');
        nodes.chooseBlockProject.classList.add('btn');
        nodes.chooseBlockProject.textContent = 'Project';

        nodes.chooseBlockOptions.appendChild(nodes.chooseBlockClient);
        nodes.chooseBlockOptions.appendChild(nodes.chooseBlockGroup);
        nodes.chooseBlockOptions.appendChild(nodes.chooseBlockProject);
        nodes.chooseBlock.appendChild(nodes.chooseBlockDescription);
        nodes.chooseBlock.appendChild(nodes.chooseBlockOptions);

        nodes.clients = document.createElement('div');
        nodes.clients.classList.add('block');

        nodes.client1 = document.createElement('div');
        nodes.client1.classList.add('pv-btn-clients', 'btn', 'btn-xs', 'inline-block-tight');
        nodes.client1.textContent = 'blip';

        nodes.client2 = document.createElement('div');
        nodes.client2.classList.add('pv-btn-clients', 'btn', 'btn-xs', 'inline-block-tight');
        nodes.client2.textContent = 'jccguimaraes';

        nodes.clients.appendChild(nodes.client1);
        nodes.clients.appendChild(nodes.client2);

        nodes.icons = document.createElement('div');
        nodes.icons.classList.add('block');
        nodes.icon1 = document.createElement('span');
        nodes.icon1.classList.add('icon', 'icon-alert');
        nodes.icons.appendChild(nodes.icon1);

        nodes.icon2 = document.createElement('span');
        nodes.icon2.classList.add('icon', 'icon-alignment-align');
        nodes.icons.appendChild(nodes.icon2);

        nodes.icon2 = document.createElement('span');
        nodes.icon2.classList.add('icon', 'icon-alignment-aligned-to');
        nodes.icons.appendChild(nodes.icon2);

        this.appendChild(nodes.topic);
        this.appendChild(nodes.inputName);
        this.appendChild(nodes.error);
        this.appendChild(nodes.chooseBlock);
        this.appendChild(nodes.clients);
        this.appendChild(nodes.icons);
        this.appendChild(nodes.save);
        this.appendChild(nodes.cancel);

        viewNodes.set(this, nodes);
    },
    attachedCallback: function attachedCallback() {
        viewNodes.get(this).inputName.focus();
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    definition: definition,
    methods: htmlMethods
};
