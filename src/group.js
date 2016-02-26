'use strict';

const CompositeDisposable = require('atom').CompositeDisposable,
    Emitter = require('atom').Emitter,
    ProjectsPool = require('./projects-pool');

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

        this.pool = new ProjectsPool(candidate.projects);
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
            'on-did-set-name',
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

}

module.exports = Group;
