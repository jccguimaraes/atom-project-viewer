'use strict';

/**
 * A Class that represents the view of a group
 * @extends HTMLElement
 */
class GroupElement extends HTMLElement {

    /**
     * Description.
     */
    createdCallback () {
        this.classList.add('list-nested-item', 'expanded');

        this.elements = {};
        this.elements.listItem = document.createElement('div');
        this.elements.listItem.classList.add('list-item');
        this.elements.listItem.addEventListener('click', () => {
            this.classList.toggle('collapsed');
            this.classList.toggle('expanded');
        });
        this.elements.listItemText = document.createElement('span');

        this.elements.listTree = document.createElement('ul');
        this.elements.listTree.classList.add('list-tree', 'has-flat-children');

        this.elements.listItem.appendChild(
            this.elements.listItemText
        );
        this.appendChild(this.elements.listItem);
        this.appendChild(this.elements.listTree);
    }

    /**
     * Description.
     */
    attachedCallback () {
        this.model.onDidChangeName(
            this.changeName.bind(this)
        );
        this.model.onDidChangeColor(
            this.changeColor.bind(this)
        );
        this.model.onDidAddProject(
            this.addProject.bind(this)
        );
        this.model.onDidEditProject(
            this.editProject.bind(this)
        );
        this.model.onDidRemoveProject(
            this.removeProject.bind(this)
        );

        this.changeName(
            this.model.getName()
        );
        this.model.getProjects().forEach(
            this.addProject.bind(this)
        );
    }

    /**
     * Description.
     */
    detachedCallback () {}

    initialize (model) {
        if (!model) {
            return;
        }
        this.model = model;

        return this;
    }

    changeName (name) {
        if (!name) {
            return;
        }
        this.elements.listItemText.textContent = name;
    }

    changeColor (color) {
        if (!color) {
            return;
        }
        return color;
    }

    addProject (project) {
        if (!project) {
            return;
        }
        this.elements.listTree.appendChild(
            atom.views.getView(project)
        );
    }

    editProject (project) {
        return project;
    }

    removeProject (project) {
        return project;
    }
}

module.exports = document.registerElement(
    'pv-group',
    {
        prototype: GroupElement.prototype,
        extends: 'li'
    }
);
