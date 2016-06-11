'use strict';

const _constructors = new WeakMap();

const viewRegistry = {};

/**
 * @param definition an object that was previously registered with a given view constructor
 * @returns a new view
 */
viewRegistry.renderView = function _renderView (definition) {
    if (!definition) {
        return null;
    }

    let constructor = this.getConstructor(definition);

    if (!constructor) {
        return undefined;
    }

    return new constructor();
};

const _component = {
    renderView: function _renderView (definition) {
        let constructor = this.getConstructor(definition);
        return new constructor();
    },
    getConstructor: function getConstructor(definition) {
        return _constructors.get(definition);
    },
    register: function register(elementObj, model) {
        let customElement;
        let elementExtends;

        if (elementObj && elementObj.hasOwnProperty('custom')) {
            customElement = elementObj.custom;
        } else {
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
