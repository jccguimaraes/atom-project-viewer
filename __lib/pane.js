'use strict';

const definition = {
    custom: 'pv-pane'
};

const htmlMethods = {
    createdCallback: function createdCallback () {}
    getTitle: function getTitle () {
        return 'Project Viewer';
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    definition: definition,
    methods: htmlMethods
};
