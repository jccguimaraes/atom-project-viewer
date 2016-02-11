'use strict';

class LoaderElement extends HTMLElement {

    createdCallback () {
        this.classList.add(
            'loading',
            'loading-spinner-small',
            'inline-block'
        );

        this.addEventListener('animationend', (evt) => {
            if (evt.animationName === 'fadeOut') {
                this.model.emitter.emit('on-did-faded-out');
            } else if (evt.animationName === 'fadeIn') {
                this.model.emitter.emit('on-did-faded-in');
            }
        }, false);
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
