'use strict';

const CompositeDisposable = require('atom').CompositeDisposable,
    Emitter = require('atom').Emitter,
    Project = require('./project');

/**
 * A Class that represents a group
 */
class Group {

    /**
     * Description.
     */
    constructor (candidate) {

        this.disposables = new CompositeDisposable();

        this.disposables.add(
            atom.views.addViewProvider({
                modelConstructor: Group,
                viewConstructor: require('./group-element')
            })
        );

        this.emitter = new Emitter();

        if (!candidate) {
            return;
        }
        this.setName(candidate.name);
        this.setColor(candidate.color);
        this.setIsExpanded(candidate.isExpanded);
        this.setProjects(candidate.projects);
    }

    onDidChangeIsExpanded (callback) {
        this.emitter.on(
            'on-did-change-is-expanded',
            callback
        );
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
    onDidChangeColor (callback) {
        this.emitter.on(
            'on-did-change-color',
            callback
        );
    }

    /**
     * Description.
     * @public
     */
    onDidChangeProjects (callback) {
        this.emitter.on(
            'on-did-change-projects',
            callback
        );
    }

    /**
     * Description.
     * @public
     */
    onDidAddProject (callback) {
        this.emitter.on(
            'on-did-add-project',
            callback
        );
    }

    /**
     * Description.
     * @public
     */
    onDidEditProject (callback) {
        this.emitter.on(
            'on-did-edit-project',
            callback
        );
    }

    /**
     * Description.
     * @public
     */
    onDidRemoveProject (callback) {
        this.emitter.on(
            'on-did-remove-project',
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
    setIsExpanded (isExpanded) {
        if (isExpanded !== undefined || typeof isExpanded !== 'boolean') {
            return;
        }

        this.isExpanded = isExpanded;
        this.emitter.emit(
            'on-did-change-is-expanded',
            this.getIsExpanded()
        );
    }

    /**
     * Description.
     * @public
     */
    getIsExpanded () {
        return this.isExpanded;
    }

    /**
     * Description.
     * @public
     */
    setColor (color) {
        if (!color) {
            return;
        }
        this.color = color;
        this.emitter.emit(
            'on-did-change-color',
            this.getColor()
        );
    }

    /**
     * Description.
     * @public
     */
    getColor () {
        return this.color;
    }

    /**
     * Description.
     * @public
     */
    addProject (candidate) {
        if (!Array.isArray(this.projects)) {
            this.projects = [];
        }
        let project = new Project(candidate);
        this.projects.push(project);
        this.emitter.emit(
            'on-did-add-project',
            project
        );
    }

    /**
     * Description.
     * @public
     */
    setProjects (candidates) {
        if (!Array.isArray(candidates) || candidates.length === 0) {
            this.projects = [];
            return;
        }

        candidates.forEach(
            this.addProject.bind(this)
        );
    }

    getProjects () {
        return this.projects;
    }

    /**
     * Description.
     * @public
     */
    register () {}

    /**
     * Description.
     * @public
     */
    unregister () {}

    onDidSetAsSelected (callback) {
        this.emitter.on(
            'on-did-set-as-selected',
            callback
        );
    }
    /**
     * Description.
     * @public
     */
    setAsSelected () {
        this.emitter.emit(
            'on-did-set-as-selected',
            this
        );
    }
}

module.exports = Group;
