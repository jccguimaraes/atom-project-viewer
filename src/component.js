'use strict';

const _utils = require('./utils');
const _constructors = new WeakMap();

const _component = {
    getConstructor: function getConstructor(definition) {
        return _constructors.get(definition);
    },
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

        if (_constructors.has(elementObj)) {
            return _constructors.get(elementObj);
        }

        let registers = {
            prototype: model
        };

        if (elementExtends) {
            registers.extends = elementExtends;
        }

        _constructors.set(elementObj, document.registerElement(
            customElement,
            registers
        ));

        Object.setPrototypeOf(model, HTMLElement.prototype);

        return _constructors.get(elementObj);
    }
};

module.exports = _component;
