'use strict';

// atom
const CompositeDisposable = require('atom').CompositeDisposable,
    File = require('atom').File,
// node
    Path = require('path'),
// custom
    Constants = require('./constants');

class DataBase {

    constructor () {

        function updated(data) {
            let obj,
                objIdx;
            if (!data || !data.type || !DataBase.data || !DataBase.data[data.type]) {
                return;
            }

            obj = DataBase.data[data.type].filter(function someType(someType) {
                return someType.name === data.object.name;
            }, data);
            objIdx = DataBase.data[data.type].indexOf(obj[0]);

            if (data.action === 'add' && !obj.length) {
                DataBase.data[data.type].push(data.object);
                this.writeFile(DataBase.data);
            } else if (data.action === 'remove' && obj.length) {
                DataBase.data[data.type].splice(objIdx, 1);
                this.writeFile(DataBase.data);
            } else if (data.action === 'edit' && obj.length) {
                DataBase.data[data.type][objIdx] = data.object;
                this.writeFile(DataBase.data);
            }
        }

        function onDidAddPaneItem(event) {
            let file,
                addToBuffer;
            if (event && event.item && event.item.buffer && event.item.buffer.file) {
                file = Path.normalize(Path.join(event.item.buffer.file.path));
                addToBuffer = atom.project.getPaths().some(function (projPath) {
                    return file.search(projPath) !== -1;
                });
                if (DataBase.active && addToBuffer) {
                    if (!DataBase.active.buffers) {
                        DataBase.active.buffers = [];
                    }
                    if (DataBase.active.buffers.indexOf(file) === -1) {
                        DataBase.active.buffers.push(file);
                        this.writeFile(DataBase.data);
                    }
                }
            }
        }

        function onDidDestroyPaneItem(event) {
            let file, bufferIdx;
            if (event && event.item && event.item.buffer && event.item.buffer.file) {
                file = Path.normalize(Path.join(event.item.buffer.file.path));
                if (DataBase.active && DataBase.active.buffers) {
                    bufferIdx = DataBase.active.buffers.indexOf(file);
                    if (bufferIdx !== -1) {
                        DataBase.active.buffers.splice(bufferIdx, 1);
                        this.writeFile(DataBase.data);
                    }
                }
            }
        }

        DataBase.disposables = new CompositeDisposable();
        DataBase.data = Constants.app.defaultData;
        DataBase.busy = false;
        DataBase.active;

        DataBase.file = new File(Path.normalize(
            Path.join(
                atom.packages.packageDirPaths[0],
                Constants.app.package,
                Constants.app.file
            )
        ));

        DataBase.file.emitter.on(Constants.events.updated, updated.bind(this));

        DataBase.disposables.add(DataBase.file.onDidChange(this.onChangeFile.bind(this)));

        DataBase.disposables.add(atom.workspace.onDidAddPaneItem(onDidAddPaneItem.bind(this)));

        DataBase.disposables.add(atom.workspace.onDidDestroyPaneItem(onDidDestroyPaneItem.bind(this)));
    }

    deactivate () {
        DataBase.disposables.dispose();
        DataBase.emitter.dispose();
    }

    // ============================================================================================ \\

    initialize () {
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

    onChangeFile () {
        this.readFile();
    }

    readFile () {
        function readedFile(text) {
            if (text && this.validate(text)) {
                DataBase.data = JSON.parse(text);
                DataBase.file.emitter.emit(Constants.events.updated, DataBase.data);
            }
        }
        return DataBase.file.read()
            .then(readedFile.bind(this));
    }

    writeFile (data) {
        function cueRequest(data) {
            return new Promise(function (resolve) {
                setTimeout(function await() {
                    if (!DataBase.busy) {
                        return resolve({ message: 'OK to save next data!', data: data });
                    } else {
                        return cueRequest();
                    }
                }, 1000);
            });
        }
        function writtenFile() {
            DataBase.busy = false;
            this.readFile();
            return Promise.resolve({ message: 'File was written!' });
        }

        if (this.validate(data)) {
            cueRequest(data).then(function (content) {
                DataBase.busy = true;
                return DataBase.file.write(JSON.stringify(content.data, null, 4))
                    .then(writtenFile.bind(this));
            });

        }
        // return Promise.reject({ message: Constants.app.saveError});
    }

    createFile () {
        function createdFile(wasCreated) {
            return wasCreated ?
                Promise.resolve({ message: 'File was created!' }) :
                Promise.reject({ message: 'File exists!' });
        }
        return DataBase.file.create()
            .then(createdFile);
    }

    validate (data) {
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

    static openFile () {
        function openFile(path) {
            atom.workspace.open(path);
        }
        DataBase.file.getRealPath().then(openFile);
    }
}

module.exports = DataBase;
