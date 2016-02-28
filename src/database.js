'use strict';

const Path = require('path'),
    Fs = require('fs'),
    EventEmitter = require('events'),
    json = Path.join(atom.styles.configDirPath, 'project-viewer2.json');

class Database {

    constructor () {

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

        this.onDidChangeLocal(
            (db) => {
                console.debug(db);
            }
        );

        this.onDidChangeFile(
            (db) => {
                console.debug(db);
            }
        );
    }

    onDidChangeLocal (callback) {
        this.emitter.on(
            'on-did-change-local',
            callback
        );
    }

    onDidChangeFile (callback) {
        this.emitter.on(
            'on-did-change-file',
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
    setDB (db, from) {
        let place = from === 'local' ? 'local' : 'file';
        this.db = db;
        this.emitter.emit(
            'on-did-change-'.concat(place),
            this.getDB()
        );
    }

    getDB () {
        return this.db;
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
