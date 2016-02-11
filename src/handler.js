'use strict';

const CompositeDisposable = require('atom').CompositeDisposable,
    HandlerElement = require('./handler-element');

class Handler {

    constructor () {
        this.disposables = new CompositeDisposable();
        this.disposables.add(
            atom.views.addViewProvider(
                Handler,
                function (model) {
                    return new HandlerElement().initialize(model);
                }
            )
        );
    }
}

module.exports = Handler;
