'use strict';

/**
 * A Class that represents the view of a group
 * @extends HTMLElement
 */
class StatusBarElement extends HTMLElement {

    /**
     * Description.
     */
    createdCallback () {
        this.classList.add('inline-block');
        this.insertAdjacentHTML(
            'beforeend',
            '<span></span>'
        );
    }

    /**
     * Description.
     */
    attachedCallback () {
        this.model.onDidChangeStatusBar(
            this.updateContent.bind(this)
        );

        this.model.onDidToggleVisible(
            this.toggleVisibility.bind(this)
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

    updateContent (content) {
        let element = this.querySelector('span');

        if (!element) {
            return;
        }

        element.textContent = content;
    }

    toggleVisibility (status) {
        if (status) {
            this.classList.add('enabled');
        } else {
            this.classList.remove('enabled');
        }
    }
}

module.exports = document.registerElement(
    'status-bar-project-viewer',
    {
        prototype: StatusBarElement.prototype,
        extends: 'div'
    }
);
