'use strict';

const ProjectView = require('./project-view');

class ProjectGroupView extends HTMLElement {

    // native
    createdCallback () {
        this.classList.add('list-tree', 'has-flat-children');
    }

    attachedCallback () {}

    detachedCallback () {}

    // custom

    setGroup (group) {
        this.group = group;
    }

    addProjects (projects) {
        let projectView;

        if (!projects) {
            return;
        }
        function forEachProject(project) {
            if (!this.group || !this.group.name || project.group !== this.group.name) {
                return;
            }
            this.projects.push(project);
            projectView = new ProjectView();
            projectView.setProject(project);
            this.appendChild(projectView);
        }
        this.projects = [];
        projects.forEach(forEachProject, this);
    }
}

module.exports = document.registerElement(
    'projects-view',
    {
        prototype: ProjectGroupView.prototype,
        extends: 'ul'
    }
);
