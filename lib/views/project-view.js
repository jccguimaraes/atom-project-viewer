'use strict';

const Path = require('path'),
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
        isChosen = project.paths.every(function (path, idx) {
            if (!atomProjs[idx]) {
                return false;
            }
            return Path.normalize(Path.join(path, Path.sep)) === Path.normalize(Path.join(atomProjs[idx], Path.sep));
        });

        this.setAttribute('data-project', this.project.name);
        this.setAttribute('data-group', this.project.group);

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

        this.addEventListener('click', function clickProject(event) {
            let listItems,
                i;

            if (DataBase.active === this.project) {
                return;
            }

            listItems = document.querySelectorAll('ul[is="groups-view"] .list-item span.chosen');
            for (i = 0; i < listItems.length; i++) {
                listItems[i].classList.remove('chosen');
            }
            this.span.classList.add('chosen');
            DataBase.active = this.project;
            event.stopPropagation();

            this.bufferFiles();
        });
    }

    bufferFiles () {

        function forEachOldPath(path) {
            atom.project.removePath(path);
        }

        function forEachNewPath(path) {
            atom.project.addPath(Path.normalize(Path.join(path, Path.sep)));
        }

        function forEachGetBuffer(buffer) {
            if (this.project.buffers.indexOf(buffer.file.path) === -1 && !buffer.previousModifiedStatus) {
                atom.project.removeBuffer(buffer);
            }
        }

        function forEachBuffer(buffer) {
            atom.workspace.open(buffer);
        }

        atom.project.getPaths().forEach(forEachOldPath);
        this.project.paths.forEach(forEachNewPath);

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
