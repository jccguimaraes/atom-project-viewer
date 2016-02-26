'use strict';

class LoaderElement extends HTMLElement {

    createdCallback () {
        this.classList.add(
            'loading',
            'loading-spinner-small',
            'inline-block'
        );
    }

    attachedCallback () {}

    detachedCallback () {}

    initialize (model) {
        if (!model) {
            return;
        }
        this.model = model;

        this.model.onDidChangeState(this.toggle.bind(this));

        return this;
    }

    toggle (state) {
        state ? this.classList.add('enabled') : this.classList.remove('enabled');
    }

    serialize () {
        return this.model;
    }
}

module.exports = document.registerElement(
    'pv-loader',
    {
        prototype: LoaderElement.prototype,
        extends: 'span'
    }
);
