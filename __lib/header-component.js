'use strict';

const _utils = require('./utils');

const definition = {
    custom: 'pv-header'
};

const htmlMethods = {
    createdCallback: function createdCallback() {
        this.classList.add('padded');
        this.textContent = 'Project Viewer';
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    definition: definition,
    methods: htmlMethods
};
