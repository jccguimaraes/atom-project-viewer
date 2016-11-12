'use strict';

const _utils = require('./utils');
const _utility = require('./utilities');
const _db = require('./db');
const _gateway = require('./gateway');
const _colors = require('./colors');

const definition = {
    custom: 'pv-list-nested-item',
    extends: 'li'
};

function clickListener(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.toggleExpand();
    _utility.getDB().storage = _utility.getDB().store();
}

function dragStartListener(evt) {
    evt.stopPropagation();
    event.dataTransfer.setData('pv-dropview', this.getId());
}

function dragOverListener(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.dataTransfer.dropEffect = 'move';
    this.classList.add('over');
    return false;
}

function dragLeaveListener(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.classList.remove('over');
    return false;
}

function dragEnterListener(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    return false;
}

function dropListener(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.classList.remove('over');

    let dropNode = document.getElementById(evt.dataTransfer.getData('pv-dropview'));

    if (!dropNode) {
        _utils.notification('warning', 'nothing to add', {
            icon: 'horizontal-rule'
        });
        return;
    }

    let dropModel = _db.mapper.get(dropNode);
    let thisModel = _db.mapper.get(this);

    if (thisModel.type === dropModel.type) {
        const child = dropNode.nextSibling === this ? this.nextSibling : this;
        this.parentElement.insertBefore(dropNode, child);
        return;
    }

    if (dropModel.type === 'client') {
        return;
    }

    let dropPrototype = Object.getPrototypeOf(dropModel);
    let thisPrototype = Object.getPrototypeOf(thisModel);

    let didAdd = this.addChild(dropNode);

    if (didAdd) {
        Object.setPrototypeOf(dropModel, thisModel);
        _db.store();
        _utility.updateStatusBar();
    }

    return false;
}

const htmlMethods = {
    createdCallback: function createdCallback() {
        if (!this.nodes) {
            this.nodes = {};
        }
        this.classList.add('list-nested-item');

        this.nodes.listItem = document.createElement('div');
        this.nodes.listItem.classList.add('list-item');
        this.nodes.listItemSpan = document.createElement('span');

        this.nodes.listItem.appendChild(this.nodes.listItemSpan);
        this.appendChild(this.nodes.listItem);

        this.setAttribute('draggable', true);
    },
    detachedCallback: function detachedCallback() {
        this.removeEventListener('click', clickListener);
        this.removeEventListener('dragstart', dragStartListener);
        this.removeEventListener('dragover', dragOverListener);
        this.removeEventListener('dragleave', dragLeaveListener);
        this.removeEventListener('dragenter', dragEnterListener);
        this.removeEventListener('drop', dropListener);
    },
    attachedCallback: function attachedCallback() {
        this.addEventListener('click', clickListener, false);
        this.addEventListener('dragstart', dragStartListener, false);
        this.addEventListener('dragover', dragOverListener, false);
        this.addEventListener('dragleave', dragLeaveListener, false);
        this.addEventListener('dragenter', dragEnterListener, false);
        this.addEventListener('drop', dropListener, false);
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
    addChild: function addChild(node, sort, force) {
        let parent = this.querySelector('ul[is="pv-list-tree"]');

        if (node.hasNode && (!parent || node.hasNode(parent))) {
            return;
        }
        parent.addNode(node, force);
        if (sort) {
            this.sortChildren();
        }
        return true;
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

        const sanitizedText = _utils.sanitizeString(text);

        if (!sanitizedText) {
            return;
        }
        if (typeof sanitizedText !== 'string') {
            _utils.notification('info', 'text is not valid', {
                icon: 'code'
            });
            return;
        }
        this.nodes.listItemSpan.textContent = sanitizedText;
    },
    getText: function getText() {
        return this.nodes.listItemSpan.textContent;
    },
    getIcon: function getIcon() {
        let filteredClasses;
        this.nodes.listItemSpan.classList.forEach(
            (ownClass) => {
                if (ownClass !== 'icon') {
                    filteredClasses = ownClass;
                }
            });
        return filteredClasses;
    },
    setIcon: function setIcon(icon, removeOld) {
        if (!icon) {
            this.nodes.listItemSpan.classList.remove(this.getIcon());
            return;
        }
        if (typeof icon !== 'string') {
            _utils.notification('info', 'icon is not valid', {
                icon: 'code'
            });
            return;
        }

        if (removeOld) {
            this.nodes.listItemSpan.classList.remove(this.getIcon());
        }
        this.nodes.listItemSpan.classList.add('icon', icon);
    },
    setExpanded: function setExpanded(state) {
        let thisModel = _utility.getDB().mapper.get(this);

        if (state) {
            this.classList.add('expanded');
            this.classList.remove('collapsed');
        } else {
            this.classList.remove('expanded');
            this.classList.add('collapsed');
        }

        if (thisModel.hasOwnProperty('clientExpanded')) {
            thisModel.clientExpanded = state;
        } else if (thisModel.hasOwnProperty('groupExpanded')) {
            thisModel.groupExpanded = state;
        }
    },
    setColor: function setColor (color) {
        let thisModel = _utility.getDB().mapper.get(this);

        _colors.setRule(
            this.getId(),
            thisModel.type,
            color
        );
    },
    getColor: function getColor () {
        return this.nodes.listItem.style.color;
    },
    toggleExpand: function toggleExpand() {
        this.classList.toggle('expanded');
        this.classList.toggle('collapsed');

        let thisModel = _utility.getDB().mapper.get(this);
        let state = this.classList.contains('expanded');

        if (thisModel.hasOwnProperty('clientExpanded')) {
            thisModel.clientExpanded = state;
        } else if (thisModel.hasOwnProperty('groupExpanded')) {
            thisModel.groupExpanded = state;
        }
    },
    setId: function setId() {
        let model = _utility.getDB().mapper.get(this);
        if (!model) {
            return;
        }
        this.id = model.groupId || model.clientId;
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

            if (sort.includes('alphabetically') &&
            typeof currentNode.getText === 'function' &&
            typeof nextNode.getText === 'function') {
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
    definition: definition,
    methods: htmlMethods
};
