'use strict';

const _utils = require('./utils');
const _db = require('./db');

const component = {
    custom: 'pv-list-tree',
    extends: 'ul'
};

const htmlMethods = {
    createdCallback: function createdCallback() {
        if (!this.nodes) {
            this.nodes = {};
        }
        this.classList.add('list-tree');
    },
    attachedCallback: function attachedCallback() {
        this.addEventListener('dragover', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            return false;
        });
        this.addEventListener('dragenter', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            return false;
        });

        this.addEventListener('drop', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();

            let dropNode = document.getElementById(evt.dataTransfer.getData('project'));

            if (!dropNode) {
                _utils.notification('warning', 'no HTML element was dragged', {
                    icon: 'horizontal-rule'
                });
                return;
            }

            let dropModel = _db.projectsMap.get(dropNode);

            let projectsContainer = this.querySelector('.has-collapsable-children > ul[is="pv-list-tree"]:last-child');
            projectsContainer.addNode(dropNode);

            return false;
        });
    },
    setAsRootLevel: function setAsRootLevel() {
        this.classList.add('has-collapsable-children');
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
