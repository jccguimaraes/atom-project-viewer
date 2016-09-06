'use strict';

const _gateway = require('./gateway');

const locals = {};

function f_createdCallback () {
    _gateway.local.set(this, locals);

    locals.header = document.createElement('h1');
    locals.header.textContent = 'Choose what to add:';
}

function f_attachedCallback () {}

function f_detachedCallback () {}

function f_setItem (item) {}

const _definition = {
    custom: 'pv-modal'
};

const _htmlMethods = {
    // HTMLElement overrides
    createdCallback: f_createdCallback,
    attachedCallback: f_attachedCallback,
    detachedCallback: f_detachedCallback,
    // custom methods
    setItem: f_setItem
};

Object.setPrototypeOf(_htmlMethods, HTMLElement);

module.exports = {
    definition: _definition,
    methods: _htmlMethods
};
