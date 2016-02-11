'use strict';

/**
 * A Class that represents the view of a group
 * @extends HTMLElement
 */
class ProjectElement extends HTMLElement {

    /**
     * Description.
     */
    createdCallback () {
        this.classList.add('list-item');

        this.elements = {};
        this.elements.listItemText = document.createElement('span');
        this.appendChild(
            this.elements.listItemText
        );
    }

    /**
     * Description.
     */
    attachedCallback () {
        this.addEventListener('click', () => {
            // this.classList.add('selected');
            this.model.addPaths();
            this.model.setAsSelected();
        });
        this.elements.listItemText.textContent = this.model.getName();
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
}

module.exports = document.registerElement(
    'pv-project',
    {
        prototype: ProjectElement.prototype,
        extends: 'li'
    }
);
