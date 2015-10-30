'use strict';

const ProjectsView = require('./projects-view'),
    Constants = require('./../helpers/constants'),
    DataBase = require('./../helpers/database');

class GroupView extends HTMLElement {

    // native
    createdCallback () {
        this.classList.add('list-nested-item', 'collapsed');
    }

    attachedCallback () {}

    detachedCallback () {}

    // custom
    setGroup (group) {
        this.group = group;
    }

    setProjects (projects) {
        if (!projects) {
            return;
        }
        this.projects = DataBase.data.projects.filter(function filterProjects(project) {
            return this.group.name === project.group;
        }, this);
        this.setName();
        this.addProjects();
    }

    setName () {
        let self,
            groupNameContainer,
            groupNameIcon,
            groupNameText;

        if (!this.group || !this.group.name) {
            return;
        }
        self = this;

        groupNameContainer = document.createElement('div');
        groupNameContainer.classList.add('list-item');
        groupNameContainer.setAttribute('data-group', this.group.name);
        groupNameContainer.addEventListener('click', function groupClick(event) {
            event.stopPropagation();
            self.classList.toggle('collapsed');
            self.group.expanded = !self.classList.contains('collapsed');
            DataBase.file.emitter.emit(Constants.events.update, {type: 'groups', action: 'edit', object: self.group});
        });
        groupNameIcon = document.createElement('span');
        groupNameIcon.classList.add(
            'icon',
            (this.group.icon ? this.group.icon : 'icon-none')
        );

        this.groupNameNumber = document.createElement('span');
        this.groupNameNumber.classList.add('group-number-projects');
        if (this.group.expanded) {
            this.classList.toggle('collapsed');
        }
        if (this.group.icon) {
            this.groupNameNumber.classList.add('highlight');
        } else {
            this.groupNameNumber.classList.add('highlight-info');
        }
        this.groupNameNumber.textContent = this.projects.length;

        groupNameText = document.createElement('span');
        groupNameText.classList.add('list-item');
        groupNameText.textContent = this.group.name;

        groupNameContainer.appendChild(groupNameIcon);
        groupNameContainer.appendChild(this.groupNameNumber);
        groupNameContainer.appendChild(groupNameText);
        this.appendChild(groupNameContainer);
    }

    addProjects () {
        let projectsView = new ProjectsView();
        projectsView.setGroup(this.group);
        projectsView.addProjects(this.projects);
        this.appendChild(projectsView);
    }

    updateNumberOfProjects () {
        this.projects = DataBase.data.projects.filter(function filterProjects(project) {
            return this.group.name === project.group;
        }, this);
        this.groupNameNumber.textContent = this.projects.length;
    }
}

module.exports = document.registerElement(
    'group-view',
    {
        prototype: GroupView.prototype,
        extends: 'li'
    }
);
