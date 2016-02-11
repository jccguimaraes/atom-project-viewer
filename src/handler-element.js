'use strict';

class HandlerElement extends HTMLElement {

    createdCallback () {}

    attachedCallback () {}

    detachedCallback () {}

    initialize (model) {
        if (!model) {
            return;
        }
        this.model = model;

        return this;
    }

    serialize () {
        return this.model;
    }
}

module.exports = document.registerElement(
    'pv-handler',
    {
        prototype: HandlerElement.prototype
    }
);
