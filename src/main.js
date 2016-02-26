'use strict';

const CompositeDisposable = require('atom').CompositeDisposable,
    Emitter = require('atom').Emitter,
    Database = require('./database'),
    Constants = require('./constants'),
    Loader = require('./loader'),
    Handler = require('./handler'),
    GroupsPool = require('./groups-pool'),
    Topic = require('./topic'),
    StatusInfo = require('./status-info');

/**
 * A Class that represents the Project Viewer
 */
class Main {

    constructor () {
        this.disposables = new CompositeDisposable();

        this.disposables.add(
            atom.views.addViewProvider({
                modelConstructor: Main,
                viewConstructor: require('./main-element')
            })
        );

        this.emitter = new Emitter();

        this.loader = new Loader();

        this.handler = new Handler();

        this.topic = new Topic(Constants.TOPIC);

        this.groupsPool = new GroupsPool();

        this.statusInfo = new StatusInfo();

        this.database = new Database();

        this.database.updateDB();

        this.database.onDidChangeDatabase(() => {
            this.updateContent(() => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 200);
                });
            });
        });
    }

    destroy () {
        this.disposables.dispose();
        delete this.loader;
        delete this.handler;
        delete this.topic;
        delete this.groupsPool;
    }

    enableLoader () {
        this.loader.setState(true);
    }

    disableLoader () {
        this.loader.setState(false);
    }

    updateContent (callback) {
        if (typeof callback !== 'function') {
            return;
        }

        this.enableLoader();

        callback()
            .then(
                this.disableLoader.bind(this),
                this.disableLoader.bind(this)
            )
            .then(() => {
                this.groupsPool.setGroups(this.database.getDB());
            });
    }

    onDidAddFile (callback) {
        if (typeof callback !== 'function') {
            return;
        }

        this.emitter.on(
            'on-did-add-file',
            callback
        );
    }

    onDidCloseFile (callback) {
        if (typeof callback !== 'function') {
            return;
        }

        this.emitter.on(
            'on-did-close-file',
            callback
        );
    }
}

module.exports = Main;
