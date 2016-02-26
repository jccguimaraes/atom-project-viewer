'use strict';

const CompositeDisposable = require('atom').CompositeDisposable,
    Emitter = require('atom').Emitter;

/**
 * A Class that represents a project
 */
class StatusInfo {

    /**
     * Description.
     */
    constructor () {
        this.disposables = new CompositeDisposable();
        this.disposables.add(
            atom.views.addViewProvider({
                modelConstructor: StatusInfo,
                viewConstructor: require('./status-info-element')
            })
        );
        this.emitter = new Emitter;
    }

}

module.exports = StatusInfo;
