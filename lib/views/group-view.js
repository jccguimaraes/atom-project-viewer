'use strict';

const ProjectsView = require('./projects-view');

class GroupView extends HTMLElement {

    // native
    createdCallback() {
        this.classList.add('list-nested-item', 'collapsed');
    }

    attachedCallback() {}

    detachedCallback() {}

    // custom
    setGroup(group) {
        this.group = group;
    }

    setProjects(projects) {
        this.projects = projects.filter(function filterProjects(project) {
            return this.group.name === project.group;
        }, this);
        this.setName();
        this.addProjects();
    }

    setName() {
        if ( !this.group || !this.group.name) {
            return;
        }
        let self = this;
        let groupNameContainer = document.createElement('div');
        groupNameContainer.classList.add('list-item');
        groupNameContainer.addEventListener('click', function groupClick(event) {
            event.stopPropagation();
            self.classList.toggle('collapsed');
        });
        let groupNameIcon = document.createElement('span');
        groupNameIcon.classList.add(
            'icon',
            (this.group.icon ? this.group.icon : 'icon-none')
        );

        let groupNameNumber = document.createElement('span');
        groupNameNumber.classList.add('group-number-projects');
        if (this.group.icon) {
            groupNameNumber.classList.add('highlight');
        } else {
            groupNameNumber.classList.add('highlight-info');
        }
        groupNameNumber.textContent = this.projects.length;

        let groupNameText = document.createElement('span');
        groupNameText.classList.add('list-item');
        groupNameText.textContent = this.group.name;

        groupNameContainer.appendChild(groupNameIcon);
        groupNameContainer.appendChild(groupNameNumber);
        groupNameContainer.appendChild(groupNameText);
        this.appendChild(groupNameContainer);
    }

    addProjects() {
        let projectsView = new ProjectsView();
        projectsView.setGroup(this.group);
        projectsView.addProjects(this.projects);
        this.appendChild(projectsView);
    }
}

module.exports = GroupView;

module.exports = document.registerElement(
    'group-view',
    {
        prototype: GroupView.prototype,
        extends: 'li'
    }
);
