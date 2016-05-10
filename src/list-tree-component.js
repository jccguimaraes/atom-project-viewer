'use strict';

const _utility = require('./utilities');
const _utils = require('./utils');
const _db = require('./db');

const definition = {
    custom: 'pv-list-tree',
    extends: 'ul'
};

const dragStartListener = function dragStartListener() {}
const dragOverListener = function dragOverListener() {}
const dragLeaveListener = function dragLeaveListener() {}
const dragEnterListener = function dragEnterListener() {}
const dragEndListener = function dragEndListener() {}
const dropListener = function dropListener() {

}

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
            evt.dataTransfer.dropEffect = 'move';
            this.classList.add('over');
            return false;
        });

        this.addEventListener('dragleave', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            this.classList.remove('over');
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
            this.classList.remove('over');

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

            if (thisModel) {
                Object.setPrototypeOf(dropModel, thisModel);
            } else {
                Object.setPrototypeOf(dropModel, Object);
            }

            this.addChild(dropNode);

            _db.store();
            _utility.updateStatusBar();

            return false;
        });
    },
    setAsRootLevel: function setAsRootLevel() {
        this.classList.add('has-collapsable-children');
    },
    setType: function setType(type) {
        this.setAttribute('data-type', type);
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
        this.addNode(node);
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
    definition: definition,
    methods: htmlMethods
};