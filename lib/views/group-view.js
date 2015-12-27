'use strict';

const path = require('path'),
    ProjectsView = require('./projects-view'),
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
        if (this.group.expanded) {
            this.classList.remove('collapsed');
        } else {
            this.classList.add('collapsed');
        }
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

        function handleDragOver(event) {
            if (event.preventDefault) {
                event.preventDefault();
            }
            event.dataTransfer.dropEffect = 'move';
            return false;
        }

        function handleDragDrop(event) {
            if (event.preventDefault) {
                event.preventDefault();
            }

            if (!this.group && !this.group.name) {
                return false;
            }

            let targetProject = JSON.parse(event.dataTransfer.getData('text/plain'));

            if (!targetProject && !targetProject.group) {
                return false;
            }

            if (targetProject.group !== this.group.name) {
                DataBase.file.emitter.emit(
                    Constants.events.update, {
                        type: 'projects',
                        action: 'edit',
                        object: targetProject,
                        edited: {
                            group: this.group.name
                        }
                    }
                );
            }
        }

        groupNameContainer.addEventListener('dragover', handleDragOver, false);

        groupNameContainer.addEventListener('drop', handleDragDrop.bind(this), false);

        groupNameContainer.addEventListener('click', function groupClick(event) {
            event.stopPropagation();
            self.group.expanded = !self.group.expanded;
            self.setGroup(self.group);
            DataBase.file.emitter.emit(Constants.events.update, {type: 'groups', action: 'edit', object: self.group});
        });
        groupNameIcon = document.createElement('span');
        groupNameIcon.classList.add(
            'icon',
            (this.group.icon ? this.group.icon : 'icon-none')
        );

        this.groupNameNumber = document.createElement('span');
        this.groupNameNumber.classList.add('group-number-projects');
        if (this.group.icon) {
            this.groupNameNumber.classList.add('highlight');
        } else {
            this.groupNameNumber.classList.add('highlight-info');
        }

        if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this.group.color)) {
            this.CSSRule = 'div[is="project-viewer-view"] li[is="group-view"]' + (atom.config.get('project-viewer.onlyGroupColors') ? ' > ' : '') + ' .list-item[data-group="' + this.group.name + '"] { color: ' + this.group.color + '; }';
            this.docSheet = document.querySelector('style[source-path="' + path.join(atom.packages.packageDirPaths[0], 'project-viewer', 'styles', 'project-viewer.less') + '"]');
            if (this.docSheet && this.docSheet.sheet) {
                if (this.ruleIdx) {
                    this.docSheet.sheet.deleteRule(this.ruleIdx);
                }
                this.ruleIdx = this.docSheet.sheet.insertRule(this.CSSRule, this.docSheet.sheet.rules.length);
            }
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
