'use strict';

const Path = require('path'),
    Notification = require('atom').Notification,
    Constants = require('./../helpers/constants'),
    DataBase = require('./../helpers/database');

class ProjectView extends HTMLElement {

    // native
    createdCallback () {
        this.classList.add('list-item');
        this.span = document.createElement('span');
        this.appendChild(this.span);
    }

    attachedCallback () {}

    detachedCallback () {}

    // custom
    setProject (project) {
        let atomProjs,
            isChosen;

        this.project = project;
        this.setName();
        this.setPaths();

        atomProjs = atom.project.getPaths();

        if (Array.isArray(project.paths)) {
            project.paths = project.paths.reduce(function (o, v) {
                o[v] = '';
                return o;
            }, {});
        }
        isChosen = Object.keys(project.paths).every(function (path, idx) {
            if (!atomProjs[idx]) {
                return false;
            }
            return Path.normalize(Path.join(path, Path.sep)) === Path.normalize(Path.join(atomProjs[idx], Path.sep));
        });
        this.setAttribute('draggable', true);
        this.setAttribute('data-project', this.project.name);
        this.setAttribute('data-group', this.project.group);

        function handleDragStart() {
            event.dataTransfer.setData('text/plain', JSON.stringify(this.project));
        }

        function handleDragOver(event) {
            if (event.preventDefault) {
                event.preventDefault();
            }
            event.dataTransfer.dropEffect = 'move';
            return false;
        }

        function handleDragDrop(event) {
            if (event.preventDefault) {
                event.preventDefault();
            }

            if (!this.project && !this.project.group) {
                return false;
            }

            let targetProject = JSON.parse(event.dataTransfer.getData('text/plain'));

            if (!targetProject && !targetProject.group) {
                return false;
            }

            if (targetProject.group !== this.project.group) {
                DataBase.file.emitter.emit(
                    Constants.events.update, {
                        type: 'projects',
                        action: 'edit',
                        object: targetProject,
                        edited: {
                            group: this.project.group
                        }
                    }
                );
            }
        }

        this.addEventListener('dragstart', handleDragStart.bind(this), false);
        this.addEventListener('dragover', handleDragOver.bind(this), false);
        this.addEventListener('drop', handleDragDrop.bind(this), false);

        if (isChosen) {
            this.span.classList.add('chosen');
            DataBase.active = this.project;
        }
    }

    setName () {
        if (!this.project || !this.project.name) {
            return;
        }
        this.span.textContent = this.project.name;
    }

    setPaths () {
        if (!this.project || !this.project.paths) {
            return;
        }

        function saveStateOfProject(parent, saveToObj) {
            let children,
                c;

            children = parent.querySelector('.list-tree').querySelectorAll(':scope > .directory');

            if (!children) {
                return;
            }
            for (c = 0; c < children.length; c++) {
                let directory = children[c].directory;
                saveToObj.entries[directory.name] = {
                    expanded: directory.expansionState.isExpanded,
                    entries: {}
                };
                saveStateOfProject(children[c], saveToObj.entries[directory.name]);
            }
        }

        this.addEventListener('click', function clickProject(event) {
            let listItems,
                i,
                treeView,
                rootPaths,
                pr,
                state;

            event.stopPropagation();

            if (DataBase.active === this.project) {
                return;
            }

            listItems = document.querySelectorAll('ul[is="groups-view"] .list-item span.chosen');
            for (i = 0; i < listItems.length; i++) {
                listItems[i].classList.remove('chosen');
            }
            this.span.classList.add('chosen');

            if (DataBase.active) {
                treeView = document.querySelector('.tree-view');
                if (treeView) {
                    rootPaths = treeView.querySelectorAll('.project-root');
                    state = {};

                    for (pr = 0; pr < rootPaths.length; pr++) {
                        let path = rootPaths[pr].directory.realPath;
                        state[rootPaths[pr].directory.name] = {
                            expanded: rootPaths[pr].directory.expansionState.isExpanded,
                            entries: {}
                        };
                        saveStateOfProject(rootPaths[pr], state[rootPaths[pr].directory.name]);

                        if (DataBase.active.paths.hasOwnProperty(path)) {
                            DataBase.active.paths[path] = JSON.stringify(state);
                            delete state[rootPaths[pr].directory.name];
                        }
                    }

                    DataBase.file.emitter.emit(Constants.events.update, {
                        type: 'projects',
                        action: 'edit',
                        object: DataBase.active
                    });
                }
            }
            DataBase.active = this.project;

            this.bufferFiles();
        });
    }

    bufferFiles () {

        let projectPath;

        function forEachOldPath(path) {
            atom.project.removePath(path);
        }

        function forEachNewPath(path, state) {
            let states,
                notification,
                treeView,
                rootPaths,
                pr;

            function setStateOfProject(parent, parentState) {
                let children,
                    c;
                if (parentState[parent.directory.name] && parentState[parent.directory.name].expanded) {
                    parent.expand();
                    children = parent.querySelector('.list-tree').querySelectorAll(':scope > .directory');
                    if (!children) {
                        return;
                    }
                    for (c = 0; c < children.length; c++) {
                        setStateOfProject(children[c], parentState[parent.directory.name].entries);
                    }
                } else {
                    parent.collapse();
                }
            }

            try {
                states = JSON.parse(state);
            } catch (e) {
                notification = new Notification('info', Constants.app.errors.projectStateNone, {
                    dismissable: true
                });
                atom.notifications.addNotification(notification);
            }

            atom.project.addPath(Path.normalize(Path.join(path, Path.sep)));

            if (!states) {
                return;
            }

            treeView = document.querySelector('.tree-view');

            if (!treeView || !states) {
                return;
            }

            rootPaths = treeView.querySelectorAll('.project-root');

            if (atom.config.get('project-viewer.foldersCollapsed')) {
                rootPaths[rootPaths.length - 1].collapse();
            } else {
                setStateOfProject(rootPaths[rootPaths.length - 1], states);
            }
        }

        function forEachGetBuffer(buffer) {
            if (buffer && buffer.file && buffer.file.path &&
                (this.project.buffers.indexOf(buffer.file.path) === -1 && !buffer.previousModifiedStatus)
            ) {
                atom.project.removeBuffer(buffer);
            }
        }

        function forEachBuffer(buffer) {
            atom.workspace.open(buffer);
        }

        atom.project.getPaths().forEach(forEachOldPath);

        if (Array.isArray(this.project.paths)) {
            this.project.paths = this.project.paths.reduce(function (o, v) {
                o[v] = '';
                return o;
            }, {});
            DataBase.file.emitter.emit(Constants.events.update, {
                type: 'projects',
                action: 'edit',
                object: this.project
            });
        }

        for (projectPath in this.project.paths) {
            forEachNewPath(projectPath, this.project.paths[projectPath]);
        }

        if (atom.config.get('project-viewer.openBuffers') && this.project.buffers) {
            atom.project.getBuffers().reverse().forEach(forEachGetBuffer, this);
            this.project.buffers.forEach(forEachBuffer);
        }
    }
}

module.exports = document.registerElement(
    'project-view',
    {
        prototype: ProjectView.prototype,
        extends: 'li'
    }
);
