'use strict';

const Path = require('path'),
    CompositeDisposable = require('atom').CompositeDisposable,
    Emitter = require('atom').Emitter,
    ProjectElement = require('./project-element'),
    privates = new WeakMap();

/**
 * Set changes in the private variable.
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
 * Get a private variable.
 * @private
 * @param {string} property - The name of the variable.
 * @return {string|number} ...
 */
function fetch(property) {
    return privates.get(this)[property];
}

/**
 * A Class that represents a project
 */
class Project {

    /**
     * Description.
     */
    constructor (candidate) {
        this.disposables = new CompositeDisposable();
        this.disposables.add(
            atom.views.addViewProvider({
                modelConstructor: Project,
                viewConstructor: ProjectElement
            })
        );
        this.emitter = new Emitter;

        privates.set(this, {
            paths: [],
            buffers: []
        });

        if (!candidate) {
            return;
        }

        this.setName(candidate.name);
        this.setPaths(candidate.paths);
    }

    /**
     * Description.
     * @public
     */
    onDidChangeName (callback) {
        this.emitter.on(
            'on-did-change-name',
            callback
        );
    }

    /**
     * Description.
     * @public
     */
    setName (name) {
        if (!name || typeof name !== 'string') {
            return;
        }
        this.name = name;
        this.emitter.emit(
            'on-did-change-name',
            this.getName()
        );
    }

    /**
     * Description.
     * @public
     */
    getName () {
        return this.name;
    }

    /**
     * Description.
     * @public
     */
    setGroup (group) {
        if (!group || typeof group !== 'string') {
            return;
        }
        this.group = group;
    }

    /**
     * Description.
     * @public
     */
    getGroup () {
        return this.group;
    }

    addPaths () {
        let updatedProjects = [];
        this.getPaths().forEach((path) => {
            let normalized = Path.normalize(Path.join(path, Path.sep));
            updatedProjects.push(normalized);
        });
        atom.project.setPaths(updatedProjects);
    }

    /**
     * Description.
     * @public
     */
    setPaths (paths) {
        if (!Array.isArray(paths)) {
            return;
        }
        save.call(this, 'paths', paths);
    }

    /**
     * Description.
     * @public
     */
    getPaths () {
        return fetch.call(this, 'paths');
    }

    /**
     * Description.
     * @public
     */
    setBuffers (buffers) {
        if (!Array.isArray(buffers)) {
            return;
        }
        buffers.forEach(function (bufferObj, bufferIdx) {
            atom.project.buffers[bufferIdx]
                .onDidDestroy(() => {
                    console.debug('destroyed');
                }
            );
        });
        save.call(this, 'buffers', buffers);
    }

    /**
     * Description.
     * @public
     */
    getBuffers () {
        return fetch.call(this, 'paths');
    }

    setAsSelected () {
        this.emitter.emit(
            'on-did-change-project',
            this
        )
    }
}

module.exports = Project;
