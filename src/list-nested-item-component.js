'use strict';

const _utils = require('./utils');
const _db = require('./db');

const component = {
    custom: 'pv-list-nested-item',
    extends: 'li'
};

const htmlMethods = {
    createdCallback: function createdCallback() {
        if (!this.nodes) {
            this.nodes = {};
        }
        this.classList.add('list-nested-item', 'expanded');

        this.nodes.listItem = document.createElement('div');
        this.nodes.listItem.classList.add('list-item');
        this.nodes.listItemSpan = document.createElement('span');

        this.nodes.listItem.appendChild(this.nodes.listItemSpan);
        this.appendChild(this.nodes.listItem);

        this.setAttribute('draggable', true);
    },
    attachedCallback: function attachedCallback() {
        this.addEventListener('click', (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            this.classList.toggle('expanded');
            this.classList.toggle('collapsed');
        });

        this.addEventListener('dragstart', (evt) => {
            evt.stopPropagation();
            event.dataTransfer.setData('pv-dropview', this.getId());
        });

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

            let dropNode = document.getElementById(evt.dataTransfer.getData('pv-dropview'));

            if (!dropNode) {
                _utils.notification('warning', 'nothing to add', {
                    icon: 'horizontal-rule'
                });
                return;
            }

            let dropModel = _db.mapper.get(dropNode);
            let thisModel = _db.mapper.get(this);

            Object.setPrototypeOf(dropModel, thisModel);
            this.addChild(dropNode);

            _db.save();

            return false;
        });
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
        this.sortChildren();
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
    },
    setText: function setText(text) {
        if (!text) {
            return;
        }
        if (typeof text !== 'string') {
            _utils.notification('info', 'text is not valid', {
                icon: 'code'
            });
            return;
        }
        this.nodes.listItemSpan.textContent = text;
    },
    getText: function getText() {
        return this.nodes.listItemSpan.textContent;
    },
    setIcon: function setIcon(icon) {
        if (!icon) {
            return;
        }
        if (typeof icon !== 'string') {
            _utils.notification('info', 'icon is not valid', {
                icon: 'code'
            });
            return;
        }
        this.nodes.listItemSpan.classList.add('icon', icon);
    },
    setId: function setId(id) {
        if (!id) {
            return;
        }
        if (typeof id !== 'string') {
            _utils.notification('info', 'id is not valid', {
                icon: 'code'
            });
            return;
        }
        this.id = id
    },
    getId: function getId() {
        return this.id;
    },
    sortChildren: function sortChildren() {
        let thisModel = _db.mapper.get(this);
        let sort = thisModel.sortBy;

        if (!sort) {
            return;
        }

        let view = this.querySelector('ul');
        let children = Array.apply(null, view.childNodes);
        let reverse = sort.includes('reverse') ? -1 : 1;
        let results = children.sort((currentNode, nextNode) => {
            let result;

            if (sort.includes('alphabetic')) {
                result = reverse * new Intl.Collator().compare(
                    currentNode.getText(),
                    nextNode.getText()
                );
            } else if (sort.includes('position')) {
                result = -reverse;
            }
            if (result === 1) {
                view.insertBefore(nextNode, currentNode);
            }
            return result;
        });
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    component: component,
    methods: htmlMethods
};
