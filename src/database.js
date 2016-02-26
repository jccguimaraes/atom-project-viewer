'use strict';

const Path = require('path'),
    Fs = require('fs'),
    EventEmitter = require('events'),
    json = Path.join(atom.styles.configDirPath, 'project-viewer2.json');

let group,
    project;

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
        this.db = db;
        this.emitter.emit(
            'on-did-change-database',
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

    static setActiveGroup (newGroup) {
        group = newGroup;
    }

    static getActiveGroup () {
        return group;
    }

    static setActiveProject (newProject) {
        project = newProject;
    }

    static getActiveProject () {
        return project;
    }

    static addOpenedFile (file) {
        let project = Database.getActiveProject();
        let addToList = false;

        if (!file || !project) {
            return;
        }

        if (!project.buffers || !Array.isArray(project.buffers)) {
            return;
        }

        addToList = !project.buffers.some((savedFile) => {
            return savedFile === file;
        });

        if (!addToList) {
            return;
        }

        project.addBuffer(file);
    }

    static removeClosedFile (file) {
        if (!file) {
            return;
        }
    }
}

module.exports = Database;
