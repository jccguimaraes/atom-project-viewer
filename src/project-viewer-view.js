'use strict';

/* package */
const caches = require('./caches');
const constructor = require('./constructor');

const cycleViews = function _cycleViews (parent, views) {
    if (views.view && parent && parent.attachChild) {
        parent.attachChild(views.view);
    }
    if (views.hasOwnProperty('groups')) {
        buildStructure(views.groups, views.view || parent);
    }
    if (views.hasOwnProperty('items')) {
        buildStructure(views.items, views.view || parent);
    }
};

const buildStructure = function _cycleStructure (list, parent) {
    list.forEach(cycleViews.bind(this, parent));
};

const viewMethods = {
    reset: function _reset () {
        let listTree = this.querySelector('ul.list-tree');
        if (listTree) {
            while (listTree.firstChild) {
                listTree.removeChild(listTree.firstChild);
            }
        }
    },
    populate: function _populate (structure) {
        if (!structure) {
            return;
        }
        this.reset();
        buildStructure(structure, this);
    },
    initialize: function _initialize () {
        this.setAttribute('tabindex', -1);

        let panelHeading = document.createElement('h2');
        panelHeading.classList.add('heading');
        panelHeading.textContent = 'Project-Viewer';

        let panelBody = document.createElement('div');
        panelBody.classList.add('body-content');

        let listTree = document.createElement('ul');
        listTree.classList.add(
            'list-tree',
            'has-collapsable-children',
            'pv-has-custom-icons'
        );

        this.setAttribute('draggable', 'true');

        this.addEventListener('dragstart', (evt) => {
            evt.stopPropagation();
        }, false);

        this.addEventListener('dragover', (evt) => {
            evt.preventDefault();
        }, false);

        this.addEventListener('dragleave', (evt) => {
            evt.stopPropagation();
        }, false);

        this.addEventListener('dragenter', (evt) => {
            evt.stopPropagation();
        }, false);

        this.addEventListener('dragend', (evt) => {
            evt.stopPropagation();
        }, false);

        this.addEventListener('drop', (evt) => {
            const uuid = evt.dataTransfer.getData("text/plain");
            const view = document.querySelector(
                `project-viewer li[data-project-viewer-uuid="${uuid}"]`
            );

            if (!view) { return; }

            this.attachChild(view);

            // const deadzone = getModel(evt.target);
            //
            // let landingView;
            //
            // if (!deadzone) {
            //     landingView = this;
            // }
            // else {
            //     landingView = getView(deadzone);
            // }
            //
            // if (deadzone && (deadzone.type !== 'group')) { return; }
            //
            // if (landingView === view) { return; }
            //
            // try {
            //     landingView.attachChild(view);
            // }
            // catch (e) {
            //     atom.notifications.addError('drag&drop error', {
            //         description: 'trying to add a parent to a child!'
            //     });
            // }
        }, false);

        panelBody.appendChild(listTree);

        this.appendChild(panelHeading);
        this.appendChild(panelBody);
    },
    attachChild: function _attachChild (node) {
        let listTree = this.querySelector('.list-tree');
        if (!listTree) {
            return;
        }
        listTree.appendChild(node);
    },
    detachChild: function _detachChild (node) {
        let listTree = this.querySelector('.list-tree');
        if (!listTree) {
            return;
        }
        listTree.removeChild(node);
    },
    sorting: function _sorting () {
        const model = caches.get(this);
        if (!model) { return; }

        return model.name;
    },
    autohide: function _autohide (force) {
        let method = 'toggle';
        if (force) {
            method = 'remove';
        }
        var isHidden = this.classList[method]('autohide');
        let sidebar = this.querySelector('.hidden-block');
        sidebar.classList[method]('visible', isHidden);
    }
};

const createView = function _createView (model) {
    let options = {
        tagIs: 'project-viewer'
    };
    return constructor.createView(options, viewMethods, model);
};

module.exports = {
    createView: createView
};
