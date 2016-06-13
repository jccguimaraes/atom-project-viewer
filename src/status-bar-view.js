'use strict';

const definition = {
    custom: 'pv-status-bar-view'
};

const htmlMethods = Object.create(null);

const wm = new WeakMap();

/**
 *
 */
htmlMethods.createdCallback = function _createdCallback() {
    const dom = {};
    wm.set(this, dom);

    this.classList.add('inline-block');

    dom._location = document.createElement('span');

    this.appendChild(dom._location);
};

/**
 *
 */
htmlMethods.setLocation = function _setLocation(location) {
    const dom = wm.get(this);

    if (!location || !dom) {
        return undefined;
    }

    if (!dom._location) {
        return null;
    }

    dom._location.textContent = location;

    return location;
};

/**
 *
 */
htmlMethods.getLocation = function _getLocation() {
    const dom = wm.get(this);

    if (!dom) {
        return undefined;
    }

    if (!dom._location) {
        return null;
    }

    return dom._location;
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    definition: definition,
    methods: htmlMethods
};
