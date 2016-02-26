'use strict';

const CompositeDisposable = require('atom').CompositeDisposable,
    Emitter = require('atom').Emitter,
    Project = require('./project');

let selectedProject,
    emitter = new Emitter();

/**
 * A Class that represents a project
 */
class ProjectsPool {

    constructor (candidates) {
        this.disposables = new CompositeDisposable();

        this.disposables.add(
            atom.views.addViewProvider({
                modelConstructor: ProjectsPool,
                viewConstructor: require('./projects-pool-element')
            })
        );

        this.emitter = new Emitter();

        if (!candidates) {
            return;
        }

        this.registerAll(candidates);
    }

    onDidAddProject (callback) {
        this.emitter.on(
            'on-did-add-project',
            callback
        );
    }

    validate () {
        if (!this.pool || !Array.isArray(this.pool)) {
            this.pool = [];
        }
    }

    exists (candidate) {
        return this.pool.some((project) => {
            return project.name === candidate.name;
        });
    }

    addToPool (candidate) {
        let project = new Project(candidate);

        this.pool.push(project);

        this.emitter.emit(
            'on-did-add-project',
            project
        );

        project.onDidSelectProject(
            this.updateSelectedProject.bind(this)
        );
    }

    updateSelectedProject (project) {
        let currentSelected = ProjectsPool.getSelectedProject();

        if (currentSelected) {
            currentSelected.unsetAsSelected();
        }

        ProjectsPool.setSelectedProject(project);
    }

    register (candidate) {
        let apted = false;

        if (!candidate) {
            return;
        }

        this.validate();

        apted = !this.exists(candidate);

        if (!apted) {
            return;
        }

        this.addToPool(candidate);
    }

    registerAll (projects) {
        if (!projects || !Array.isArray(projects)) {
            return;
        }

        this.validate();

        projects.forEach(this.register, this);
    }

    unregister (project) {
        if (!project) {
            return;
        }
    }

    unregisterAll (projects) {
        if (!projects || !Array.isArray(projects)) {
            return;
        }

        projects.forEach(this.unregister, this);
    }

    getAll () {
        return this.pool;
    }

    static setSelectedProject (project) {
        selectedProject = project;
        emitter.emit(
            'on-did-change-selected-project',
            project
        );
    }

    static getSelectedProject () {
        return selectedProject;
    }

    static onDidChangeSelectedProject (callback) {
        emitter.on(
            'on-did-change-selected-project',
            callback
        );
    }
}

module.exports = ProjectsPool;
