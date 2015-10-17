'use strict';

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
            atom.project.addPath(path);
        }

        this.addEventListener('click', function clickProject(event) {
            event.stopPropagation();
            atom.project.getPaths().forEach(forEachOldPath);
            this.project.paths.forEach(forEachNewPath);
        });
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
