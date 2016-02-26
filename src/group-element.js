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

        this.elements.listItem.appendChild(
            this.elements.listItemText
        );
        this.appendChild(this.elements.listItem);
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

        this.addEventListener('click', () => {
            // this.classList.add('selected');
        });

        this.changeName(
            this.model.getName()
        );

        this.appendChild(
            atom.views.getView(this.model.pool)
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

    /**
     * Description.
     */
    changeName (name) {
        if (!name) {
            return;
        }

        this.elements.listItemText.textContent = name;
    }

    /**
     * Description.
     */
    changeColor (color) {
        if (!color) {
            return;
        }
    }
}

module.exports = document.registerElement(
    'pv-group',
    {
        prototype: GroupElement.prototype,
        extends: 'li'
    }
);
