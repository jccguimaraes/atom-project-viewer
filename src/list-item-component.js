'use strict';

const _utility = require('./utilities');
const _utils = require('./utils');
const _states = require('./states');

const definition = {
    custom: 'pv-list-item',
    extends: 'li'
};

function clickListener(evt) {
    let serializationFile;
    let serialization;
    let model;
    let selected;

    evt.preventDefault();
    evt.stopPropagation();

    serializationFile = atom.getStateKey(
        atom.project.getPaths()
    );

    selected = _utility.getSelectedProjectView();

    if (selected === this) {
        return;
    }

    if (serializationFile && atom.storageFolder && typeof atom.storageFolder.storeSync === 'function') {
        let serializers = {
            project: _states.projectSerialization(),
            workspace: _states.workspaceSerialization(),
            treeview: _states.treeViewSerialization()
        };

        atom.storageFolder.storeSync(serializationFile, serializers);
    }

    model = _utility.getDB().mapper.get(this);

    if (!model.projectPaths || model.projectPaths.length === 0) {
        return;
    }

    atom.project.getRepositories().forEach((repo) => {
        if (repo && typeof repo.destroy === 'function') {
            repo.destroy();
        }
    });

    atom.workspace.getActivePane().destroy();

    serializationFile = atom.getStateKey(model.projectPaths);

    if (serializationFile) {
        serialization = atom.storageFolder.load(serializationFile);
    }

    if (serialization) {
        _states.projectDeserialization(serialization.project);
        _states.workspaceDeserialization(serialization.workspace);
        _states.treeViewDeserialization(serialization.treeview);
    } else {
        atom.project.setPaths(model.projectPaths);
    }

    if (selected) {
        selected.classList.remove('active');
        selected.classList.remove('selected');
    }
    this.classList.add('active');
    this.classList.add('selected');

    _utility.setSelectedProjectView(this);
};

function dragStartListener(evt) {
    evt.stopPropagation();
    event.dataTransfer.setData('pv-dropview', this.getId());
};

function dragOverListener(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.dataTransfer.dropEffect = 'move';
    this.classList.add('over');
    return false;
};

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

function dragEndListener(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.classList.remove('over');
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

    let dropModel = _utility.getDB().mapper.get(dropNode);
    let thisModel = _utility.getDB().mapper.get(this);

    if (dropModel.type === 'client' || dropModel.type === 'group') {
        return;
    }

    if (dropModel.type === thisModel.type && dropModel.type === 'project') {
        const child = dropNode.nextSibling === this ? this.nextSibling : this;
        this.parentElement.insertBefore(dropNode, child);
    } else {
        this.parentElement.addNode(dropNode);
    }

    let dropPrototype = Object.getPrototypeOf(dropModel);
    let thisPrototype = Object.getPrototypeOf(thisModel);

    if (dropPrototype !== thisPrototype) {
        Object.setPrototypeOf(dropModel, thisPrototype);
    }

    _utility.getDB().storage = _utility.getDB().store();

    _utility.updateStatusBar();

    return false;
}

const htmlMethods = {
    createdCallback: function createdCallback() {
        if (!this.nodes) {
            this.nodes = {};
        }
        this.classList.add('list-item');

        this.nodes.span = document.createElement('span');

        this.appendChild(this.nodes.span);

        this.setAttribute('draggable', true);
    },
    detachedCallback: function detachedCallback() {
        this.removeEventListener('click', clickListener);
        this.removeEventListener('dragstart', dragStartListener);
        this.removeEventListener('dragover', dragOverListener);
        this.removeEventListener('dragleave', dragLeaveListener);
        this.removeEventListener('dragenter', dragEnterListener);
        this.removeEventListener('dragend', dragEndListener);
        this.removeEventListener('drop', dropListener);
    },
    attachedCallback: function attachedCallback() {
        this.addEventListener('click', clickListener, false);
        this.addEventListener('dragstart', dragStartListener, false);
        this.addEventListener('dragover', dragOverListener, false);
        this.addEventListener('dragleave', dragLeaveListener, false);
        this.addEventListener('dragenter', dragEnterListener, false);
        this.addEventListener('dragend', dragEndListener, false);
        this.addEventListener('drop', dropListener, false);

        this.validate();
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
        this.nodes.span.textContent = sanitizedText;
    },
    getText: function getText() {
        return this.nodes.span.textContent;
    },
    setIcon: function setIcon(icon, removeOld) {
        if (!icon) {
            this.nodes.span.classList.remove(this.getIcon());
            return;
        }
        if (typeof icon !== 'string') {
            _utils.notification('info', 'icon is not valid', {
                icon: 'code'
            });
            return;
        }

        if (removeOld) {
            this.nodes.span.classList.remove(this.getIcon());
        }
        this.nodes.span.classList.add('icon', icon);
    },
    getIcon: function getIcon() {
        let filteredClasses;
        this.nodes.span.classList.forEach(
            (ownClass) => {
                if (ownClass.startsWith('icon-')) {
                    filteredClasses = ownClass;
                }
            });
        return filteredClasses;
    },
    setId: function setId(id) {
        const sanitizedText = _utils.sanitizeString(id);

        if (!sanitizedText) {
            return;
        }
        if (typeof sanitizedText !== 'string') {
            _utils.notification('info', 'id is not valid', {
                icon: 'code'
            });
            return;
        }
        this.id = sanitizedText;
    },
    getId: function getId() {
        return this.id;
    },
    validate: function validate() {
        const model = _utility.getDB().mapper.get(this);

        if (!model || !model.projectPaths || model.projectPaths.length === 0) {
            this.classList.add('disabled');
        } else {
            this.classList.remove('disabled');
        }
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    definition: definition,
    methods: htmlMethods
};
