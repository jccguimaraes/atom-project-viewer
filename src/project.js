'use strict';

const Path = require('path'),
    Fs = require('fs'),
    Disposable = require('atom').Disposable,
    CompositeDisposable = require('atom').CompositeDisposable,
    Emitter = require('atom').Emitter;

let flag = false;
/**
 * A Class that represents a project.
 */
class Project {

    /**
     * The project can be instanciated with or without a candidate to project object.
     */
    constructor (candidate) {
        this.disposables = new CompositeDisposable();
        this.disposables.add(
            atom.views.addViewProvider({
                modelConstructor: Project,
                viewConstructor: require('./project-element')
            })
        );
        this.emitter = new Emitter;

        // TODO: change this to disposables and set the ViewProvider independent
        this.volatile = {};

        // if the constructor has a candidate, start defining it's properties.
        if (!candidate) {
            return;
        }

        // Set the name.
        this.setName(candidate.name);

        // Set the root paths.
        this.setPaths(candidate.paths);

        // Set the state of the folders in the tree-view.
        this.setTreeViewState(candidate.treeViewState);

        // Set the files that were opened
        this.setBuffers(candidate.buffers);
    }

    // =============================================
    // sets
    // =============================================

    /**
     * Sets the name for the current project.
     * @public
     */
    setName (name) {
        if (!name || typeof name !== 'string') {
            return;
        }

        this.name = name;

        this.emitter.emit(
            'on-did-set-name',
            this.getName()
        );
    }

    /**
     * Sets the root paths for the current project.
     * @public
     */
    setPaths (paths) {
        if (!paths || !Array.isArray(paths)) {
            return;
        }

        this.paths = paths;
    }

    /**
     * Description.
     * @public
     */
    setTreeViewState (state) {
        if (!state) {
            return;
        }

        this.treeViewState = state;
    }

    /**
     * Description.
     * @public
     */
    setBuffers (candidates) {

        if (!candidates || !Array.isArray(candidates)) {
            return;
        }

        this.buffers = [];

        candidates.forEach((groupOfCandidates, groupOfCandidatesIdx) => {
            let buffersForPath = this.paths[groupOfCandidatesIdx];

            groupOfCandidates.forEach((candidate) => {
                let file = Path.join(buffersForPath, candidate);

                let fileExits = Fs.statSync(file);

                if (!fileExits) {
                    return;
                }
                this.buffers.push(file);
            });
        });
    }

    // =============================================
    // gets
    // =============================================

    /**
     * Gets the name of the current project.
     * @public
     */
    getName () {
        return this.name;
    }

    /**
     * Gets the root paths of the current project.
     * @public
     */
    getPaths () {
        return this.paths;
    }

    /**
     * Description.
     * @public
     */
    getTreeViewState () {
        return this.treeViewState;
    }

    /**
     * Description.
     * @public
     */
    getBuffers () {
        return this.buffers;
    }






    /**
     * Sets initially opened files for the current project.
     * @public
     */
    openStateFiles () {
        if (!this.paths || !Array.isArray(this.paths) || this.paths.length === 0) {
            return;
        }
        if (!this.buffers || !Array.isArray(this.buffers)) {
            return;
        }

        this.buffers.forEach((fileToOpen) => {
            this.openFile(fileToOpen);
        });
    }

    /**
     * Close any file that is open
     * @public
     */
    closeOpenedFiles () {
        atom.project.getBuffers().reverse().forEach(
            (buffer) => {
                if (!buffer.previousModifiedStatus) {
                    atom.project.removeBuffer(buffer);
                }
            },
            this
        );
    }

    /**
     * ...
     * @public
     */
    openFile (file) {

        let fileExits = Fs.statSync(file);

        // should only continue if file exists physically and
        // belongs to any of the root paths
        if (!fileExits) {
            return;
        }

        if (!file || typeof file !== 'string') {
            return;
        }

        // TODO: investigate the options parameters
        atom.workspace.open(file);
        // .then((buffer) => {
        // add to the project buffer list
        // this.buffers.push(buffer.getPath());
        // });
    }







    /**
     * Description.
     * @public
     */
    updateTreeView () {
        let tvPackage = atom.packages.getActivePackage('tree-view');
        let state = this.getTreeViewState();

        if (!state) {
            return;
        }

        if (!tvPackage || !tvPackage.mainModule || !tvPackage.mainModule.treeView) {
            return;
        }

        tvPackage.mainModule.treeView.updateRoots(
            state.directoryExpansionStates
        );
    }


















    addBufferHandlers () {
        if (!this.disposables) {
            return;
        }

        this.volatile.addFile = atom.project.onDidAddBuffer((buffer) => {
            if (!buffer) {
                return;
            }

            if (!this.buffers) {
                return;
            }

            // TODO: it can only be set when active project
            this.volatile.removeFile = buffer.onDidDestroy(() => {
                if (!flag) {
                    return;
                }
                let idx = this.buffers.indexOf(buffer.getPath());
                if (idx !== -1) {
                    this.buffers.splice(idx, 1);
                }
            });

            let idx = this.buffers.indexOf(buffer.getPath());
            if (idx === -1) {
                this.buffers.push(buffer.getPath());
            }
        });

        atom.project.getBuffers().forEach((buffer) => {
            this.volatile.removeExistingFile = buffer.onDidDestroy(() => {
                if (!flag) {
                    return;
                }
                let idx = this.buffers.indexOf(buffer.getPath());
                if (idx !== -1) {
                    this.buffers.splice(idx, 1);
                }
            });
        }, this);
    }

    addBuffer (buffer) {
        if (!flag) {
            return;
        }

        let idx = this.buffers.indexOf(buffer.getPath());
        if (idx === -1) {
            this.buffers.push(buffer.getPath());
        }
    }

    removeBuffer (buffer) {
        if (!flag) {
            return;
        }

        let idx = this.buffers.indexOf(buffer.getPath());
        if (idx !== -1) {
            this.buffers.splice(idx, 1);
        }
    }

    onDidSelectProject (callback) {
        this.emitter.on(
            'on-did-select-project',
            callback
        );
    }

    onDidUnselectProject (callback) {
        this.emitter.on(
            'on-did-unselect-project',
            callback
        );
    }

    /**
     * Description.
     * @public
     */
    onDidChangeName (callback) {
        this.emitter.on(
            'on-did-set-name',
            callback
        );
    }

    setRootPaths () {
        let updatedProjects = [];
        this.getPaths().forEach((path) => {
            let normalized = Path.normalize(Path.join(path, Path.sep));
            updatedProjects.push(normalized);
        });
        atom.project.setPaths(updatedProjects);
        this.updateTreeView();
    }

    setAsSelected () {

        this.emitter.emit(
            'on-did-select-project',
            this
        );

        // register listeners for adding and removing files from the workspace
        this.addBufferHandlers();

        if (!atom.config.get('project-viewer2.keepProjectState')) {
            return;
        }

        // this.closeOpenedFiles();
        // this.openStateFiles();
    }

    unsetAsSelected () {

        this.emitter.emit(
            'on-did-unselect-project',
            this
        );

        if (!this.volatile) {
            return;
        }

        if (Disposable.isDisposable(this.volatile.addFile)) {
            this.volatile.addFile.dispose();
        }
        if (Disposable.isDisposable(this.volatile.removeFile)) {
            this.volatile.removeFile.dispose();
        }
        if (Disposable.isDisposable(this.volatile.removeExistingFile)) {
            this.volatile.removeExistingFile.dispose();
        }
    }

    isCurrentProject () {
        if (!this.paths) {
            return;
        }

        let currentPaths = atom.project.getPaths();
        let isActiveProject;

        if (currentPaths.length !== this.paths.length) {
            return;
        }

        isActiveProject = currentPaths.every((path, pathIdx) => {
            return path === this.paths[pathIdx];
        });

        if (!isActiveProject) {
            return;
        }

        this.setAsSelected();
    }
}

module.exports = Project;
