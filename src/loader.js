'use strict';

const CompositeDisposable = require('atom').CompositeDisposable,
    Emitter = require('atom').Emitter,
    LoaderElement = require('./loader-element');

/**
 * A Class that represents a loader
 */
class Loader {

    /**
     * Description.
     * @public
     */
    constructor () {
        this.disposables = new CompositeDisposable();
        this.disposables.add(
            atom.views.addViewProvider({
                modelConstructor: Loader,
                viewConstructor: LoaderElement
            })
        );
        this.emitter = new Emitter();
        this.state = false;
    }

    /**
     * Description.
     * @public
     */
    onDidFadedIn (callback) {
        this.emitter.on(
            'on-did-faded-in',
            callback
        );
    }

    /**
     * Description.
     * @public
     */
    onDidFadedOut (callback) {
        this.emitter.on(
            'on-did-faded-out',
            callback
        );
    }

    /**
     * Description.
     * @public
     */
    onDidChangeState (callback) {
        this.emitter.on(
            'on-did-change-state',
            callback
        );
    }

    /**
     * Description.
     * @public
     */
    setState (state) {
        if (typeof state !== 'boolean') {
            return;
        }
        this.state = state;
        this.emitter.emit(
            'on-did-change-state',
            this.getState()
        );
    }

    /**
     * Description.
     * @public
     */
    getState () {
        return this.state;
    }
}

module.exports = Loader;
