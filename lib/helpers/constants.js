'use strict';

module.exports = {
    app: {
        name: 'Project Viewer',
        package: 'project-viewer',
        file: 'project-viewer.json',
        defaultData: {
            groups: [],
            projects: []
        },
        checkError: 'File doesn\'t seem to exist',
        saveError: 'Data is not correctly formed!'
    },
    events: {
        click: 'click',
        updated: 'update',
        refresh: 'regresh'
    },
    groups: {
        none: 'No groups yet!',
        topicAdd: 'Add a new group!',
        topicRemove: 'Remove a group!',
        topicEdit: 'Edit a group!',
        groupName: 'Set the new group name:',
        selectGroup: 'Select the associated group:',
        deleteGroup: 'Select the group to be deleted:',
        selectIcon: 'Select the associated icon (optional):',
        buttons: {
            add: 'Add group',
            remove: 'Remove group!',
            edit: 'Edit group!',
            cancel: 'Cancel'
        }
    },
    projects: {
        topicAdd: 'Add a new project!',
        topicRemove: 'Remove a project!',
        topicEdit: 'Edit a project!',
        nameInput: 'Set the new project name:',
        groupSelect: 'Select the associated group:',
        deleteProject: 'Select the project to be deleted:',
        buttons: {
            add: 'Add project',
            remove: 'Remove project!',
            edit: 'Edit project!',
            cancel: 'Cancel'
        }
    },
    paths: {
        topic: 'Select the associated paths:',
        buttons: {
            add: 'Add paths',
            remove: 'Remove path'
        }
    }
};
