'use strict';

const _utils = require('./utils');

const component = {
    custom: 'project-viewer'
};

const htmlMethods = {
    createdCallback: function createdCallback() {
        this.setAttribute('tabindex', -1);
    },
    addNode: function addNode(node, force) {
        if (!node) {
            _utils.notification('error', 'no HTML element was passed', {
                icon: 'code'
            });
            return;
        }
        if (!force && this.hasNode(node)) {
            _utils.notification('info', 'HTML element already added', {
                icon: 'code'
            });
            return;
        }
        this.appendChild(node);
    },
    hasNode: function hasNode(node) {
        let has = false;
        for (let idx = 0; idx < this.childNodes.length; idx++) {
            if (this.childNodes[idx] === node) {
                has = true;
                break;
            }
        }
        return has;
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    component: component,
    methods: htmlMethods
};
