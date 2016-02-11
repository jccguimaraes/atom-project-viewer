'use strict';

const CompositeDisposable = require('atom').CompositeDisposable,
    Emitter = require('atom').Emitter,
    Database = require('./database'),
    Constants = require('./constants'),
    Loader = require('./loader'),
    Handler = require('./handler'),
    Groups = require('./groups'),
    Topic = require('./topic');

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
            }),
            atom.project.onDidChangePaths(function (data) {
                if (!data) {
                    return;
                }
            }),
            atom.project.onDidAddBuffer(function (data) {
                if (!data) {
                    return;
                }
            })
        );

        this.emitter = new Emitter();

        this.loader = new Loader();

        this.handler = new Handler();
        atom.views.getView(this).appendChild(
            atom.views.getView(this.handler)
        );

        this.topic = new Topic(Constants.TOPIC);
        atom.views.getView(this).appendChild(
            atom.views.getView(this.topic)
        );

        this.groups = new Groups();
        atom.views.getView(this).appendChild(
            atom.views.getView(this.groups)
        );

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
        delete this.groups;
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
                this.groups.setGroups(this.database.getDB());
            });
    }
}

module.exports = Main;
