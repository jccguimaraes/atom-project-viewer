'use strict';

const DataBase = require('./../helpers/database'),
    Constants = require('./../helpers/constants'),
    GroupView = require('./group-view'),
    ProjectView = require('./project-view');

class GroupsView extends HTMLElement {

    // native
    createdCallback () {

        function editGroupNode(data) {
            let newData,
                props;

            if (data.edited && Object.keys(data.edited).length) {
                newData = data;
                removeGroupNode.bind(this)(data);
                for (props in data.edited) {
                    newData.object[props] = data.edited[props];
                }
                addGroupNode.bind(this)(newData);
            }
        }

        function removeGroupNode(data) {
            let i;

            for (i = this.children.length - 1; i >= 0; i--) {
                if (this.children[i].children[0].lastChild.textContent === data.object.name) {
                    this.removeChild(this.children[i]);
                    break;
                }
            }
        }

        function addGroupNode(data) {
            let i,
                groupView,
                alreadyHas;

            for (i = this.children.length - 1; i >= 0; i--) {
                if (
                    this.children[i].children[0] && this.children[i].children[0].lastChild &&
                    this.children[i].children[0].lastChild.textContent.toLowerCase() === data.object.name.toLowerCase()) {
                    alreadyHas = true;
                    break;
                }
                if (
                    this.children[i].children[0] && this.children[i].children[0].lastChild &&
                    this.children[i].children[0].lastChild.textContent.toLowerCase() < data.object.name.toLowerCase()) {
                    break;
                }
            }

            if (alreadyHas) {
                return;
            }

            groupView = new GroupView();
            groupView.setGroup(data.object);
            groupView.setProjects(DataBase.data.projects);

            if (i === -1) {
                this.insertBefore(groupView, this.children[0]);
            } else if (i === this.children.length - 1) {
                this.appendChild(groupView);
            } else {
                this.insertBefore(groupView, this.children[i].nextSibling);
            }
        }

        function editProjectNode(data) {
            let newData,
                props;

            if (data.edited && Object.keys(data.edited).length) {
                newData = data;
                removeProjectNode.bind(this)(data);
                for (props in data.edited) {
                    newData.object[props] = data.edited[props];
                }
                addProjectNode.bind(this)(newData);
            }
        }

        function removeProjectNode(data) {
            let g,
                p;
            for (g = this.children.length - 1; g >= 0; g--) {
                if (
                    this.children[g].children[0] && this.children[g].children[0].lastChild &&
                    this.children[g].children[0].lastChild.textContent.toLowerCase() === data.object.group.toLowerCase()) {
                    break;
                }
            }

            for (p = this.children[g].children[1].children.length - 1; p >= 0; p--) {
                if (this.children[g].children[1].children[p].lastChild.textContent.toLowerCase() === data.object.name.toLowerCase()) {
                    this.children[g].children[1].removeChild(this.children[g].children[1].children[p]);
                    break;
                }
            }

            this.children[g].updateNumberOfProjects();
        }

        function addProjectNode(data) {
            let g,
                p,
                projectView,
                alreadyHas;
            for (g = this.children.length - 1; g >= 0; g--) {
                if (
                    this.children[g].children[0] && this.children[g].children[0].lastChild &&
                    this.children[g].children[0].lastChild.textContent.toLowerCase() === data.object.group.toLowerCase()) {
                    break;
                }
            }

            for (p = this.children[g].children[1].children.length - 1; p >= 0; p--) {
                if (this.children[g].children[1].children[p].getAttribute('data-project').toLowerCase() === data.object.name.toLowerCase()) {
                    alreadyHas = true;
                }
                if (this.children[g].children[1].children[p].getAttribute('data-project').toLowerCase() < data.object.name.toLowerCase()) {
                    break;
                }
            }

            if (alreadyHas) {
                return;
            }
            projectView = new ProjectView();
            projectView.setProject(data.object);

            if (p === -1) {
                this.children[g].children[1].insertBefore(projectView, this.children[g].children[1].children[0]);
            } else if (p === this.children[g].children[1].children.length - 1) {
                this.children[g].children[1].appendChild(projectView);
            } else {
                this.children[g].children[1].insertBefore(projectView, this.children[g].children[1].children[p].nextSibling);
            }

            this.children[g].updateNumberOfProjects();
        }

        function refreshedData(data) {
            this.innerHTML = '';

            if (DataBase.data.groups.length > 0) {
                this.addProjects(data.projects);
                this.addGroups(data.groups);
            } else {
                this.appendChild(this.backgroundContainer);
                if (DataBase.data.message) {
                    this.backgroundMessage.textContent = DataBase.data.message;
                } else {
                    this.backgroundMessage.textContent = Constants.groups.none;
                }
            }
        }

        function updatedData(data) {
            if (DataBase.data.groups.length > 0 && this.children[0] && this.children[0].classList && this.children[0].classList.contains('background-message')) {
                this.removeChild(this.children[0]);
                this.addProjects(data.projects);
                this.addGroups(data.groups);
            }
            if (data.type === 'groups' && data.action === 'add') {
                addGroupNode.bind(this)(data);
            } else if (data.type === 'groups' && data.action === 'remove') {
                removeGroupNode.bind(this)(data);
            } else if (data.type === 'groups' && data.action === 'edit') {
                editGroupNode.bind(this)(data);
            }

            if (data.type === 'projects' && data.action === 'add') {
                addProjectNode.bind(this)(data);
            } else if (data.type === 'projects' && data.action === 'remove') {
                removeProjectNode.bind(this)(data);
            } else if (data.type === 'projects' && data.action === 'edit') {
                editProjectNode.bind(this)(data);
            }

            if (!DataBase.data.groups.length) {
                this.innerHTML = '';
                this.appendChild(this.backgroundContainer);
            } else if (this.contains(this.backgroundContainer)) {
                this.removeChild(this.backgroundContainer);
            }
        }

        this.classList.add('list-tree', 'has-collapsable-children');
        this.setAttribute('tabindex', '-1');
        DataBase.file.emitter.on(Constants.events.update, updatedData.bind(this));
        DataBase.file.emitter.on(Constants.events.refresh, refreshedData.bind(this));
    }

    attachedCallback () {}

    detachedCallback () {}

    // custom
    addGroups (groups) {
        function forEachGroup(group) {
            let groupView;
            if (!group.name) {
                return;
            }
            this.groups.push(group);
            groupView = new GroupView();
            groupView.setGroup(group);
            groupView.setProjects(this.projects);
            this.appendChild(groupView);
        }
        this.groups = [];
        if (groups && groups.length) {
            groups.forEach(forEachGroup, this);
        } else {
            this.backgroundContainer = document.createElement('ul');
            this.backgroundContainer.classList.add('background-message');
            this.backgroundMessage = document.createElement('li');
            this.backgroundMessage.textContent = Constants.groups.none;

            this.backgroundContainer.appendChild(this.backgroundMessage);
            this.appendChild(this.backgroundContainer);
        }
    }

    addProjects (projects) {
        this.projects = projects;
    }
}

module.exports = document.registerElement(
    'groups-view',
    {
        prototype: GroupsView.prototype,
        extends: 'ul'
    }
);
