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

            if (!this.classList.contains('has-collapsable-children')) {
                return;
            }

            let dropNode = document.getElementById(evt.dataTransfer.getData('pv-dropview'));

            if (!dropNode) {
                _utils.notification('warning', 'nothing to add', {
                    icon: 'horizontal-rule'
                });
                return;
            }

            let dropModel = _db.mapper.get(dropNode);
            let thisModel = _db.mapper.get(this);

            // if (thisModel) {
            //     Object.setPrototypeOf(dropModel, thisModel);
            // }

            this.addChild(dropNode);

            _db.save();

            return false;
        });
    },
    setAsRootLevel: function setAsRootLevel() {
        this.classList.add('has-collapsable-children');
    },
    addNode: function addNode(node, force) {
        if (!node) {
            _utils.notification('error', 'nothing to add', {
                icon: 'code'
            });
            return;
        }
        if (!force && this.hasNode(node)) {
            _utils.notification('info', 'it\'s already here!', {
                icon: 'code'
            });
            return;
        }
        this.appendChild(node);
    },
    addChild: function addChild(node) {
        this.querySelector('ul').addNode(node);
        // this.sortChildren();
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
