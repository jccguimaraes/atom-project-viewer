'use strict';

/**
 * A Class that represents the view of the pool of groups
 * @extends HTMLElement
 */
class GroupsElement extends HTMLElement {

    /**
     * Description.
     */
    createdCallback () {
        this.classList.add('list-tree', 'has-collapsable-children');
        this.elements = {};
    }

    /**
     * Description.
     */
    attachedCallback () {}

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

    appendGroup (group) {
        this.appendChild(atom.views.getView(group));
    }

    clear () {
        while (this.hasChildNodes()) {
            this.removeChild(this.lastChild);
        }
    }
}

module.exports = document.registerElement(
    'pv-groups',
    {
        prototype: GroupsElement.prototype,
        extends: 'ul'
    }
);
