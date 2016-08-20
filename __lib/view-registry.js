'use strict';

const _constructors = new WeakMap();

const viewRegistry = Object.create(null);

/**
 *
 */
viewRegistry.register = function _register (view) {
    let customElement;
    let elementExtends;

    if (view && view.definition && view.definition.hasOwnProperty('custom')) {
        customElement = view.definition.custom;
    } else {
        return;
    }

    if (view.definition.hasOwnProperty('extends')) {
        elementExtends = view.definition.extends;
    }

    if (_constructors.has(view.definition)) {
        return _constructors.get(view.definition);
    }

    let registers = {
        prototype: view.methods
    };

    if (elementExtends) {
        registers.extends = elementExtends;
    }

    _constructors.set(view.definition, document.registerElement(
        customElement,
        registers
    ));

    Object.setPrototypeOf(view.methods, HTMLElement.prototype);

    return _constructors.get(view.definition);
};

/**
 * @param defines an object that was previously registered with a given view constructor
 * @returns a new view
 */
viewRegistry.renderView = function _renderView (view) {
    if (!view || !view.definition) {
        return null;
    }

    let constructor = _constructors.get(view.definition);

    if (!constructor) {
        return undefined;
    }

    return new constructor();
};

module.exports = viewRegistry;
