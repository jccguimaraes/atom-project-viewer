'use strict';

const _utils = require('./utils');
const _utility = require('./utilities');

const definition = {
    custom: 'pv-update-modal'
};

const viewNodes = new WeakMap();


const htmlMethods = {
    createdCallback: function createdCallback() {
        let nodes = {};

        viewNodes.set(this, nodes);

        this.classList.add('block');

        nodes.topic = document.createElement('h1');
        nodes.topic.textContent = 'Choose what to update:';

        nodes.inputName = document.createElement('atom-text-editor');
        nodes.inputName.setAttribute('mini', true);

        nodes.save = document.createElement('div');
        nodes.save.classList.add('inline-block');
        nodes.saveText = document.createElement('button');
        nodes.saveText.classList.add('btn', 'btn-primary');
        nodes.saveText.textContent = 'create';

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

        this.appendChild(nodes.topic);
        this.appendChild(nodes.inputName);
        this.appendChild(nodes.save);
        this.appendChild(nodes.cancel);
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
