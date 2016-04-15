'use strict';

const _utils = require('./utils');

const component = {
    custom: 'pv-header'
};

const htmlMethods = {
    createdCallback: function createdCallback() {
        this.textContent = 'Project Viewer';
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    component: component,
    methods: htmlMethods
};
