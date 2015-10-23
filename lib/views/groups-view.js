'use strict';

const DataBase = require('./../helpers/database'),
    Constants = require('./../helpers/constants'),
    GroupView = require('./group-view');

class GroupsView extends HTMLElement {

    // native
    createdCallback () {
        function updatedData(data) {
            var i;
            for (i = this.children.length - 1; i >= 0; i--) {
                this.removeChild(this.children[i]);
            }
            this.addProjects(data.projects);
            this.addGroups(data.groups);
        }

        this.classList.add('list-tree', 'has-collapsable-children');
        DataBase.file.emitter.on(Constants.events.updated, updatedData.bind(this));
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
