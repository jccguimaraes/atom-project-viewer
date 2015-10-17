'use strict';

const Constants = require('./../helpers/constants');
const DataBase = require('./../helpers/database');

const GroupsView = require('./groups-view');

class ProjectViewerView extends HTMLElement {

    createdCallback() {

        this.classList.add('project-viewer', 'padded');

        this.insetPanel = document.createElement('div');
        this.insetPanel.classList.add('inset-panel');

        this.panelHeading = document.createElement('div');
        this.panelHeading.classList.add('panel-heading');
        this.panelHeading.textContent = Constants.app.name;

        this.panelBody = document.createElement('div');
        this.panelBody.classList.add('panel-body', 'padded');

        this.groupsView = new GroupsView();
        this.groupsView.addProjects(DataBase.data.projects);
        this.groupsView.addGroups(DataBase.data.groups);

        this.insetPanel.appendChild(this.panelHeading);
        this.insetPanel.appendChild(this.panelBody);
        this.panelBody.appendChild(this.groupsView);
        this.appendChild(this.insetPanel);
    }

    attachedCallback() {}

    detachedCallback() {}
}

module.exports = ProjectViewerView;

module.exports = document.registerElement(
    'project-viewer-view',
    {
        prototype: ProjectViewerView.prototype,
        extends: 'div'
    }
);
