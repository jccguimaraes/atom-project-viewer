'use strict';

const viewRegistry = require('./view-registry');
const statusBarView = require('./status-bar-view');

const wm = new WeakMap();
const statusBar = Object.create(null);

/**
 *
 * @returns undefined|object
 */
statusBar.initialize = function _inititialize () {
    if (wm.get(this)) {
        return undefined;
    }

    const statusBarObject = {};
    wm.set(this, statusBarObject);

    return statusBarObject;
};

/**
 *
 */
statusBar.destroy = function f_destroy () {
    if (wm.get(this)) {
        wm.delete(this);
        return undefined;
    }

    return null;
};

/**
 *
 */
statusBar.getLocation = function _getLocation () {
    const statusBarObject = wm.get(this);

    if (!statusBarObject) {
        return undefined;
    }

    if (!statusBarObject._location) {
        return null;
    }

    return statusBarObject._location;
};

/**
 *
 */
statusBar.setLocation = function _setLocation (location) {
    const statusBarObject = wm.get(this);

    if (!statusBarObject) {
        return undefined;
    }

    statusBarObject._location = location;

    return statusBarObject._location;
};

/**
 *
 */
statusBar.renderView = function _renderView () {
    const statusBarObject = wm.get(this);

    if (!statusBarObject) {
        return undefined;
    }

    const view = viewRegistry.renderView(statusBarView);

    if (view) {
        statusBarObject._view = view;
        return statusBarObject._view;
    }

    const constructorView = viewRegistry.register(statusBarView);

    if (constructorView) {
        statusBarObject._view = viewRegistry.renderView(statusBarView);
        return statusBarObject._view;
    }

    return null;
};

/**
 *
 */
statusBar.getView = function _getView () {
    const statusBarObject = wm.get(this);

    if (!statusBarObject) {
        return undefined;
    }

    if (!statusBarObject._view) {
        return null;
    }

    return statusBarObject._view;

};

module.exports = statusBar;
