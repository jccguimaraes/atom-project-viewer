'use strict';

const DataBase = require('./../helpers/database');
const GroupView = require('./group-view');

class GroupsView extends HTMLElement {

    // native
    createdCallback() {

        function updatedData(data) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                this.removeChild(this.children[i]);
            };
            this.addProjects(data.projects);
            this.addGroups(data.groups);
        }

        this.classList.add('list-tree', 'has-collapsable-children');
        this.addProjects(DataBase.data.projects);
        this.addGroups(DataBase.data.groups);
        DataBase.file.emitter.on('updatedData', updatedData.bind(this));
    }

    attachedCallback() {}

    detachedCallback() {}

    // custom
    addGroups(groups) {
        function forEachGroup(group) {
            if ( !group.name) {
                return;
            }
            this.groups.push(group);
            let groupView = new GroupView();
            groupView.setGroup(group);
            groupView.setProjects(this.projects);
            this.appendChild(groupView);
        }
        this.groups = [];
        groups.forEach(forEachGroup, this);
    }

    addProjects(projects) {
        this.projects = projects;
    }
}

module.exports = GroupsView;

module.exports = document.registerElement(
    'groups-view',
    {
        prototype: GroupsView.prototype,
        extends: 'ul'
    }
);
