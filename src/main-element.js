'use strict';

/**
 * A Class that represents the Project Viewer main view
 */
class MainElement extends HTMLElement {

    createdCallback () {
        this.setAttribute('tabindex', '-1');
    }

    attachedCallback () {}

    detachedCallback () {}

    initialize (model) {
        if (!model) {
            return;
        }

        this.model = model;

        this.appendChild(
            atom.views.getView(this.model.loader)
        );

        return this;
    }

    serialize () {
        return this.model;
    }

    toggleFocus () {
        if (document.activeElement === this) {
            atom.workspace.getActivePane().activate();
            this.downDisposable.dispose();
            this.upDisposable.dispose();
        } else {
            this.focus();
            this.upDisposable = atom.commands.add(this, {
                'core:move-up': this.moveUp.bind(this)
            });
            this.downDisposable = atom.commands.add(this, {
                'core:move-down': this.moveDown.bind(this)
            });
        }
    }

    moveUp (evt) {
        console.debug('moveUp', evt);
    }

    moveDown (evt) {
        console.debug('moveDown', evt);
    }

}

module.exports = document.registerElement(
    'project-viewer',
    {
        prototype: MainElement.prototype
    }
);
