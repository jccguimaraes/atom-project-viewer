'use strict';

const _utils = require('./utils');
const _states = require('./states');
const _db = require('./db');

const component = {
    custom: 'pv-list-item',
    extends: 'li'
};

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
    attachedCallback: function attachedCallback() {
        this.addEventListener('click', (evt) => {
            let serializationFile;
            let serialization;
            let model;

            evt.preventDefault();
            evt.stopPropagation();

            serializationFile = atom.getStateKey(
                atom.project.getPaths()
            );

            if (serializationFile) {
                atom.storageFolder.storeSync(
                    serializationFile,
                    {
                        project: _states.projectSerialization(),
                        workspace: _states.workspaceSerialization(),
                        treeview: _states.treeViewSerialization()
                    }
                );
            }

            model = _db.projectsMap.get(this);

            if (!model.projectPaths || model.projectPaths.length === 0) {
                return;
            }

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

            let selected = document.querySelector('project-viewer .active');
            if (selected) {
                selected.classList.remove('active');
            }
            this.classList.add('active');
        });

        this.addEventListener('dragstart', (evt) => {
            event.dataTransfer.setData('project', this.getId());
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

            let dropNode = document.getElementById(evt.dataTransfer.getData('project'));

            if (!dropNode) {
                _utils.notification('warning', 'no HTML element was dragged', {
                    icon: 'horizontal-rule'
                });
                return;
            }

            let dropModel = _db.projectsMap.get(dropNode);
            let thisModel = _db.projectsMap.get(this);

            return false;
        });
    },
    setText: function setText(text) {
        if (!text) {
            return;
        }
        if (typeof text !== 'string') {
            _utils.notification('info', 'list-item text is not valid', {
                icon: 'code'
            });
            return;
        }
        this.nodes.span.textContent = text;
    },
    getText: function getText() {
        return this.nodes.span.textContent;
    },
    setIcon: function setIcon(icon) {
        if (!icon) {
            return;
        }
        if (typeof icon !== 'string') {
            _utils.notification('info', 'list-item icon is not valid', {
                icon: 'code'
            });
            return;
        }
        this.nodes.span.classList.add('icon', icon);
    },
    getIcon: function getIcon() {
        return '';
    },
    setId: function setId(id) {
        if (!id) {
            return;
        }
        if (typeof id !== 'string') {
            _utils.notification('info', 'list-item id is not valid', {
                icon: 'code'
            });
            return;
        }
        this.id = id
    },
    getId: function getId() {
        return this.id;
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    component: component,
    methods: htmlMethods
};
