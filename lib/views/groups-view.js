'use strict';

const DataBase = require('./../helpers/database'),
    Constants = require('./../helpers/constants'),
    GroupView = require('./group-view');

class GroupsView extends HTMLElement {

    // native
    createdCallback () {

        function removeNode(data) {
            let i;

            for (i = this.children.length - 1; i >= 0; i--) {
                if (this.children[i].children[0].lastChild.textContent === data.object.name) {
                    this.removeChild(this.children[i]);
                    break;
                }
            }
        }

        function addNode(data) {
            let i,
                groupView;

            for (i = this.children.length - 1; i >= 0; i--) {
                if (
                    this.children[i].children[0] && this.children[i].children[0].lastChild &&
                    this.children[i].children[0].lastChild.textContent.toLowerCase() < data.object.name.toLowerCase()) {
                    break;
                }
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

        function updatedData(data) {
            if (DataBase.data.groups.length > 0 && this.children[0].classList.contains('background-message')) {
                this.removeChild(this.children[0]);
                this.addProjects(data.projects);
                this.addGroups(data.groups);
            }
            if (data.action === 'add') {
                addNode.bind(this)(data);
            } else if (data.action === 'remove') {
                removeNode.bind(this)(data);
            }

            if (!DataBase.data.groups.length) {
                this.appendChild(this.backgroundContainer);
            } else if (this.contains(this.backgroundContainer)) {
                this.removeChild(this.backgroundContainer);
            }
        }

        this.classList.add('list-tree', 'has-collapsable-children');
        DataBase.file.emitter.on(Constants.events.update, updatedData.bind(this));
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
