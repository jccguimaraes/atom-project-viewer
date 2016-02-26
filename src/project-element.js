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

        this.listItemText = document.createElement('span');
        this.appendChild(
            this.listItemText
        );
    }

    /**
     * Description.
     */
    attachedCallback () {

        this.observer = new MutationObserver(this.mutationObserver);

        // configuration of the observer:
        let config = {
            attributes: true,
            childList: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true
        };

        // pass in the target node, as well as the observer options
        this.observer.observe(this.listItemText, config);

        this.setName();

        this.addEventListener(
            'click',
            this.clickHandler.bind(this)
        );

        this.model.onDidSelectProject(() => {
            this.classList.add('selected');
        });

        this.model.onDidUnselectProject(() => {
            this.classList.remove('selected');
        });

        this.model.isCurrentProject();
    }

    detachedCallback () {
        this.observer.disconnect();
    }

    mutationObserver (mutations) {
        mutations.forEach((mutation) => {
            if (['attributes', 'childList'].indexOf(mutation.type) === -1) {
                return;
            }
        });
    }

    clickHandler () {
        this.model.setAsSelected();
        this.model.addPaths();
    }

    initialize (model) {
        if (!model) {
            return;
        }
        this.model = model;

        return this;
    }

    setName () {
        this.listItemText.textContent = this.model.getName();
    }
}

module.exports = document.registerElement(
    'pv-project',
    {
        prototype: ProjectElement.prototype,
        extends: 'li'
    }
);
