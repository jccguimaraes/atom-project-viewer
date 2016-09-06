'use strict';

const _utils = require('./utils');

const definition = {
    custom: 'pv-status-bar'
};

const htmlMethods = {
    createdCallback: function createdCallback() {
        if (!this.nodes) {
            this.nodes = {};
        }

        this.classList.add('inline-block');

        this.nodes.span = document.createElement('span');
        this.appendChild(this.nodes.span);
    },
    setText: function setText(text, id) {
        const sanitizedText = _utils.sanitizeString(text);

        if (!sanitizedText) {
            return;
        }

        this.nodes.span.textContent = sanitizedText;
    },
    getText: function getText() {
        return this.nodes.span.textContent;
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    definition: definition,
    methods: htmlMethods
};
