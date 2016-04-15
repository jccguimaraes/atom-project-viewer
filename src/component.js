'use strict';

const _utils = require('./utils');

const component = {
    constructors: {},
    register: function register(elementObj, model) {
        let customElement;
        let elementExtends;

        if (!model) {
            _utils.notification('error', 'Should implement a model object');
            return;
        }

        if (elementObj && elementObj.hasOwnProperty('custom')) {
            customElement = elementObj.custom;
        } else {
            _utils.notification('error', 'Not a valid custom element for registration');
            return;
        }

        if (elementObj.hasOwnProperty('extends')) {
            elementExtends = elementObj.extends;
        }

        if (this.constructors[customElement]) {
            return this.constructors[customElement];
        }

        let registers = {
            prototype: model
        };

        if (elementExtends) {
            registers.extends = elementExtends;
        }

        this.constructors[customElement] = document.registerElement(
            customElement,
            registers
        );

        Object.setPrototypeOf(model, HTMLElement.prototype);

        return this.constructors[customElement];
    }
};

module.exports = component;
