'use strict';

const Path = require('path');

class ProjectView extends HTMLElement {

    // native
    createdCallback() {
        this.classList.add('list-item');
    }

    attachedCallback() {}

    detachedCallback() {}

    // custom
    setProject(project) {
        this.project = project;
        this.setName();
        this.setPaths();
        this.setAsSelected();
    }

    setName() {
        if (!this.project || !this.project.name) {
            return;
        }
        this.textContent = this.project.name;
    }

    setPaths() {
        if (!this.project || !this.project.paths) {
            return;
        }

        function forEachOldPath(path) {
            atom.project.removePath(path);
        }

        function forEachNewPath(path) {
            atom.project.addPath(Path.normalize(Path.join(path, Path.sep)));
        }

        this.addEventListener('click', function clickProject(event) {
            let listItems = document.querySelectorAll('ul[is="groups-view"] .list-item.chosen');
            for (let i=0; i<listItems.length; i++) {
                listItems[i].classList.remove('chosen');
            }
            this.classList.add('chosen');
            event.stopPropagation();
            atom.project.getPaths().forEach(forEachOldPath);
            this.project.paths.forEach(forEachNewPath);
        });
    }

    setAsSelected(paths) {
        if (!this.project || !this.project.paths) {
            return;
        }
    }

}

module.exports = ProjectView;

module.exports = document.registerElement(
    'project-view',
    {
        prototype: ProjectView.prototype,
        extends: 'li'
    }
);
