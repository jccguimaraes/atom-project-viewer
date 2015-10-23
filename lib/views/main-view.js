'use strict';

const Constants = require('./../helpers/constants'),
    DataBase = require('./../helpers/database'),
    GroupsView = require('./groups-view');

class ProjectViewerView extends HTMLElement {

    createdCallback () {

        this.classList.add('project-viewer', 'padded');

        this.heading = document.createElement('h3');
        this.heading.classList.add('heading');
        this.heading.textContent = Constants.app.name;
        this.groupsView = new GroupsView();
        this.groupsView.addProjects(DataBase.data.projects);
        this.groupsView.addGroups(DataBase.data.groups);

        this.appendChild(this.heading);
        this.appendChild(this.groupsView);
    }

    attachedCallback () {}

    detachedCallback () {}
}

module.exports = document.registerElement(
    'project-viewer-view',
    {
        prototype: ProjectViewerView.prototype,
        extends: 'div'
    }
);
