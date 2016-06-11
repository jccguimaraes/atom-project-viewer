'use strict';

const definition = {
    custom: 'pv-status-bar-view'
};

const htmlMethods = {
    createdCallback: function createdCallback() {
        this.classList.add('inline-block');
    },
    setText: function setText(text) {},
    getText: function getText() {}
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    definition: definition,
    methods: htmlMethods
};
