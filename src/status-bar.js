'use strict';

const CompositeDisposable = require('atom').CompositeDisposable,
    Emitter = require('atom').Emitter;

/**
 * A Class that represents a project
 */
class StatusBar {

    /**
     * Description.
     */
    constructor () {
        this.disposables = new CompositeDisposable();
        this.disposables.add(
            atom.views.addViewProvider({
                modelConstructor: StatusBar,
                viewConstructor: require('./status-bar-element')
            })
        );
        this.emitter = new Emitter;
    }

    onDidToggleVisible (callback) {
        this.emitter.on(
            'on-did-toggle-visible',
            callback
        );
    }

    onDidChangeStatusBar (callback) {
        this.emitter.on(
            'on-did-change-status-bar',
            callback
        );
    }

    updateContent (content) {
        let textContent = '';
        if (typeof content === 'string') {
            textContent = content;
        } else if (Array.isArray(content)) {
            textContent = content.reduce((prev, curr) => {
                return prev + ' / ' + curr;
            });
        } else {
            textContent = Object.keys(content).reduce((prev, curr) => {
                return prev + ' / ' + curr;
            });
        }
        this.emitter.emit(
            'on-did-change-status-bar',
            textContent
        );
    }

    show () {
        this.emitter.emit(
            'on-did-toggle-visible',
            true
        );
    }

    hide () {
        this.emitter.emit(
            'on-did-toggle-visible',
            false
        );
    }
}

module.exports = StatusBar;
