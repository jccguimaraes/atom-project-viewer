'use strict';

// atom
const CompositeDisposable = require('atom').CompositeDisposable;
const File = require('atom').File;
// node
const Path = require('path');
// custom
const Constants = require('./constants');

class DataBase {

    constructor() {

        function updated(data) {
            if (!DataBase.data[data.type]) {
                return;
            }
            if (data.action === 'add') {
                DataBase.data[data.type].push(data.object);
                this.writeFile(DataBase.data);
            } else if (data.action === 'remove') {
                let obj = DataBase.data[data.type].filter(function someType(someType) {
                    return someType.name === data.object.name;
                }, data);
                DataBase.data[data.type].splice(DataBase.data[data.type].indexOf(obj[0]), 1);
                this.writeFile(DataBase.data);
            }
        }

        DataBase.disposables = new CompositeDisposable();
        DataBase.data = Constants.app.defaultData;
        DataBase.file = new File(Path.normalize(
            Path.join(
                atom.packages.packageDirPaths[0],
                Constants.app.package,
                Constants.app.file
            )
        ));

        DataBase.file.emitter.on('updated', updated.bind(this));

        DataBase.disposables.add(DataBase.file.onDidChange(this.onChangeFile.bind(this)));
    }

    deactivate() {
        DataBase.disposables.dispose();
        DataBase.emitter.dispose();
    }

    // ============================================================================================ \\

    initialize() {
        function fileRead() {
            this.readFile();
        }
        function fileWrite() {
            this.writeFile(Constants.app.defaultData);
        }
        return this.createFile().then(
            fileWrite.bind(this),
            fileRead.bind(this)
        );
    }

    onChangeFile() {
        this.readFile();
    }

    readFile() {
        function readedFile(text) {
            if (text/* && this.validate(text)*/) {
                DataBase.data = JSON.parse(text);
                DataBase.file.emitter.emit('updatedData', DataBase.data);
            } else {
                this.writeFile(DataBase.data);
            }
        }
        return DataBase.file.read()
            .then(readedFile.bind(this));
    }

    writeFile(data) {
        function writtenFile() {
            this.readFile();
            return Promise.resolve({ message: 'File was written!' });
        }
        return DataBase.file.write(JSON.stringify(data, null, 4))
            .then(writtenFile.bind(this));
    }

    createFile() {
        function createdFile(wasCreated) {
            return wasCreated ?
                Promise.resolve({ message: 'File was created!' }) :
                Promise.reject({ message: 'File exists!' });
        }
        return DataBase.file.create()
            .then(createdFile);
    }

    validate(data) {
        if (data && typeof data !== 'string' && !Array.isArray(data) && Object.keys(data).length === 2 &&
            data.hasOwnProperty('groups') && data.hasOwnProperty('projects') &&
            Array.isArray(data.groups) && Array.isArray(data.projects)
        ) {
            return true;
        } else if (typeof data === 'string') {
            return this.validate(JSON.parse(data));
        }
        return false;
    }

    static openFile() {
        function openFile(path) {
            atom.workspace.open(path);
        }
        DataBase.file.getRealPath().then(openFile);
    }
}

module.exports = DataBase;
