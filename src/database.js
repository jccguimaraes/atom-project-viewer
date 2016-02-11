'use strict';

const Path = require('path'),
    Fs = require('fs'),
    EventEmitter = require('events'),
    privates = new WeakMap(),
    json = Path.join(atom.styles.configDirPath, 'project-viewer2.json');

/**
* Description.
* @private
* @param {string} property - The name of the variable.
* @param {string|number} value - The name of the variable.
*/
function save(property, value) {
    let props = privates.get(this);
    props[property] = value;
    privates.set(this, props);
}

/**
* Description.
* @private
* @param {string} property - The name of the variable.
* @return {string|number} ...
*/
function fetch(property) {
    return privates.get(this)[property];
}

class Database {

    constructor () {

        privates.set(this, {
            db: {}
        });

        this.emitter = new EventEmitter();
        this.watcher = Fs.watch(json, (event) => {
            if (event === 'change') {
                this.updateDB();
            }
        });
        this.watcher.on('error', () => {
            this.emitter.emit(
                'on-did-occur-error',
                'problem with the file watcher'
            );
        });
    }

    onDidChangeDatabase (callback) {
        this.emitter.on(
            'on-did-change-database',
            callback
        );
    }

    onDidOccurDatabaseError (callback) {
        this.emitter.on(
            'on-did-occur-error',
            callback
        );
    }

    /**
     * Description.
     * @public
     */
    setDB (db) {
        save.call(this, 'db', db);
        this.emitter.emit(
            'on-did-change-database',
            fetch.call(this, 'db')
        );
    }

    getDB () {
        return fetch.call(this, 'db');
    }

    readLocalFile () {
        return new Promise((resolve, reject) => {
            Fs.readFile(json, 'utf8', function (err, data) {
                let db;

                if (err) {
                    reject(err);
                }

                try {
                    db = JSON.parse(data);
                } catch (error) {
                    reject(error);
                }

                resolve(db);
            });
        });
    }

    updateDB () {
        this.readLocalFile()
            .then(
                (data) => {
                    this.setDB(data);
                }, (error) => {
                    this.emitter.emit(
                        'on-did-occur-error',
                        error
                    );
                }
            );
    }
}

module.exports = Database;
