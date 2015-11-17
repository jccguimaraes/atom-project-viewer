'use strict';

const CompositeDisposable = require('atom').CompositeDisposable,
    File = require('atom').File,
    Notification = require('atom').Notification,
    Path = require('path'),
    Constants = require('./constants');

class DataBase {

    constructor () {

        function updated(data) {
            let obj,
                objIdx,
                originalProps,
                editedProps,
                toSave;
            if (!data || !data.type || !DataBase.data || !DataBase.data[data.type]) {
                return;
            }

            obj = DataBase.data[data.type].filter(function someType(someType) {
                return someType.name === data.object.name && (data.object.group ? someType.group === data.object.group : true);
            }, data);

            objIdx = DataBase.data[data.type].indexOf(obj[0]);

            if (data.action === 'add' && !obj.length) {
                DataBase.data[data.type].push(data.object);
                DataBase.data[data.type].sort(function sortData(current, next) {
                    let currentName = current.name.toLowerCase();
                    let nextName = next.name.toLowerCase();
                    if (currentName > nextName) {
                        return 1;
                    }
                    if (currentName < nextName) {
                        return -1;
                    }
                    return 0;
                });
                toSave = true;
            } else if (data.action === 'remove' && obj.length) {
                DataBase.data[data.type].splice(objIdx, 1);
                toSave = true;
            } else if (data.action === 'edit' && obj.length) {
                let newData;
                newData = {};
                for (originalProps in data.object) {
                    newData[originalProps] = data.object[originalProps];
                }
                if (data.edited) {
                    for (editedProps in data.edited) {
                        newData[editedProps] = data.edited[editedProps];
                    }
                    DataBase.data.projects.forEach(function forEachProject(project) {
                        if (this.edite && this.object.name === project.group) {
                            project.group = this.edited.name;
                        }
                    }, data);
                }
                DataBase.data[data.type][objIdx] = newData;
                DataBase.data[data.type].sort(function sortData(current, next) {
                    let currentName = current.name.toLowerCase();
                    let nextName = next.name.toLowerCase();
                    if (currentName > nextName) {
                        return 1;
                    }
                    if (currentName < nextName) {
                        return -1;
                    }
                    return 0;
                });
                toSave = true;
            }
            if (toSave) {
                this.writeFile(DataBase.data);
            }
        }

        function onDidAddPaneItem(event) {
            let file,
                addToBuffer;
            if (event && event.item && event.item.buffer && event.item.buffer.file) {
                file = Path.normalize(Path.join(event.item.buffer.file.path));
                addToBuffer = atom.project.getPaths().some(function (projPath) {
                    return file.indexOf(projPath) !== -1;
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
                atom.getConfigDirPath(),
                Constants.app.file
            )
        ));

        DataBase.file.emitter.on(Constants.events.update, updated.bind(this));

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
            let newData;
            newData = this.sanitize(text);
            if (newData && (DataBase.data !== newData)) {
                DataBase.data = newData;
            }
            DataBase.file.emitter.emit(Constants.events.refresh, DataBase.data);
        }
        return DataBase.file.read()
            .then(readedFile.bind(this))
            .catch(readedFile.bind(this));
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
            return Promise.resolve({ message: 'File was written!' });
        }

        if (this.validate(data)) {
            cueRequest(data).then(function (content) {
                DataBase.busy = true;
                return DataBase.file.write(JSON.stringify(content.data, null, 4))
                    .then(writtenFile.bind(this));
            });

        }
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

    sanitize (data) {
        if (data && typeof data !== 'string' && !Array.isArray(data) && Object.keys(data).length === 2 &&
            data.hasOwnProperty('groups') && data.hasOwnProperty('projects') &&
            Array.isArray(data.groups) && Array.isArray(data.projects)
        ) {
            return data;
        } else if (typeof data === 'string') {
            let newData;
            try {
                newData = JSON.parse(data);
                return this.sanitize(newData);
            } catch (e) {
                let notification = new Notification('error', Constants.app.errors.fileError, {
                    dismissable: true
                });
                atom.notifications.addNotification(notification);
                return Constants.app.defaultDataWithMessage;
            }
        }
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
