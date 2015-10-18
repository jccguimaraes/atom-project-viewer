'use strict';

const path = require('path');

const ProjectView = require('./project-view');

class ProjectGroupView extends HTMLElement {

    // native
    createdCallback() {
        this.classList.add('list-tree', 'has-flat-children');
    }

    attachedCallback() {}

    detachedCallback() {}

    // custom

    setGroup(group) {
        this.group = group;
    }

    addProjects(projects) {
        if (!projects) {
            return;
        }
        let paths = atom.project.getPaths().map(function forEachPath(curPath) {
            return path.normalize(path.join(curPath, path.sep));
        });
        function forEachProject(project) {
            if ( !this.group || !this.group.name || project.group !== this.group.name) {
                return;
            }
            this.projects.push(project);
            let projectView = new ProjectView();
            projectView.setProject(project);
            projectView.setAsSelected(paths);
            this.appendChild(projectView);
        }
        this.projects = [];
        projects.forEach(forEachProject, this);
    }
}

module.exports = ProjectGroupView;

module.exports = document.registerElement(
    'projects-view',
    {
        prototype: ProjectGroupView.prototype,
        extends: 'ul'
    }
);
