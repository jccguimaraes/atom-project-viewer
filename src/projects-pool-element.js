'use strict';

/**
 * A class that represents the view of all projects from a group
 * @extends HTMLElement
 */
class ProjectsPoolElement extends HTMLElement {

    /**
     * Description.
     */
    createdCallback () {
        this.classList.add('list-tree', 'has-flat-children');
    }

    /**
     * Description.
     */
    attachedCallback () {
        this.model.onDidAddProject(this.appendProject.bind(this));

        this.model.getAll().forEach(this.appendProject.bind(this));
    }

    /**
     * Description.
     */
    detachedCallback () {}

    /**
     * Description.
     */
    initialize (model) {
        if (!model) {
            return;
        }
        this.model = model;

        return this;
    }

    /**
     * Description.
     */
    appendProject (project) {
        this.appendChild(
            atom.views.getView(project)
        );
    }
}

module.exports = document.registerElement(
    'pv-projects-pool',
    {
        prototype: ProjectsPoolElement.prototype,
        extends: 'ul'
    }
);
