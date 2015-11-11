'use strict';

const Constants = require('./../helpers/constants'),
    DataBase = require('./../helpers/database'),
    ProjectSelectionView = require('./project-selection-view'),
    GroupSelectionView = require('./group-selection-view'),
    InputSelectionView = require('./input-view'),
    PathsSelectionView = require('./paths-selection-view');

class EditProjectView extends HTMLElement {

    // native
    createdCallback () {
        let self = this;

        this.classList.add('block', 'from-top');
        this.modalTitle = document.createElement('h3');
        this.modalTitle.textContent = Constants.projects.topicEdit;

        this.projectSelect = new ProjectSelectionView();
        this.projectSelect.setDescription(Constants.projects.editProject);
        this.projectSelect.setProjects(DataBase.data.projects);
        this.projectSelect.select.addEventListener('change', function addButtonClick(event) {
            event.stopPropagation();
            let gp = event.target.value.replace('option-', '').split('-p*g-');
            let selectedProject = DataBase.data.projects.filter(function filterSelectedProject(project) {
                return project.name === this.name && project.group === this.group;
            }, {
                name: gp[0],
                group: gp[1]
            })[0];
            let selectedGroup = DataBase.data.groups.filter(function filterSelectedGroup(group) {
                return group.name === this.name;
            }, {
                name: gp[1]
            })[0];
            self.setProject(selectedProject, selectedGroup);
        });

        this.inputView = new InputSelectionView();
        this.inputView.setDescription(Constants.projects.nameInput);

        this.groupChanged = false;
        this.groupSelect = new GroupSelectionView();
        this.groupSelect.setDescription(Constants.projects.groupSelect);
        this.groupSelect.setGroups(DataBase.data.groups);
        this.groupSelect.select.addEventListener('change', function addButtonClick(event) {
            event.stopPropagation();
            let groupName = event.target.value.replace('option-', '');
            this.selectedGroup = DataBase.data.groups.filter(function filterSelectedGroup(group) {
                return group.name === this.name;
            }, {name: groupName});
            self.groupChanged = true;
        });

        this.pathsContainer = new PathsSelectionView();

        this.separator = document.createElement('hr');

        this.editButton = document.createElement('button');
        this.editButton.classList.add('inline-block', 'btn', 'btn-warning', 'icon', 'icon-alert');
        this.editButton.textContent = Constants.projects.buttons.edit;
        this.editButton.addEventListener(Constants.events.click, function addButtonClick(event) {
            event.stopPropagation();
            if (this.parentElement.editProject()) {
                this.parentElement.closeModal();
            }
        });

        this.cancelButton = document.createElement('button');
        this.cancelButton.classList.add('inline-block', 'btn');
        this.cancelButton.textContent = Constants.groups.buttons.cancel;
        this.cancelButton.addEventListener(Constants.events.click, function cancelButtonClick(event) {
            event.stopPropagation();
            this.parentElement.closeModal();
        });

        this.appendChild(this.modalTitle);
        this.appendChild(this.projectSelect);
        this.appendChild(this.inputView);
        this.appendChild(this.groupSelect);
        this.appendChild(this.pathsContainer);
        this.appendChild(this.separator);
        this.appendChild(this.editButton);
        this.appendChild(this.cancelButton);
    }

    attachedCallback () {}

    detachedCallback () {}

    // custom
    openModal () {
        this.modal = atom.workspace.addModalPanel({
            item: this,
            visible: true
        });
    }

    closeModal () {
        this.modal.destroy();
    }

    inputSetText (projectName) {
        this.inputView.input.getModel().setText(projectName);
    }

    setIcon (icon) {
        this.iconSelect.setSelectedIcon(icon);
    }

    setColor (color) {
        this.inputColor.value = color;
    }

    setProject (project, group) {
        this.selectedProject = project;
        this.selectedGroup = group;
        this.projectSelect.setDefaultProject(this.selectedProject);
        this.groupSelect.setDefaultGroup(this.selectedGroup);
        this.inputSetText(this.selectedProject.name);
        this.pathsContainer.resetPaths();
        this.pathsContainer.setPaths(Object.keys(this.selectedProject.paths));
    }

    editProject () {
        let editedProject,
            paths,
            currentPaths,
            newPaths,
            pathsIdx;

        editedProject = {};

        if (this.selectedProject.name !== this.inputView.input.getModel().getText().trim()) {
            editedProject.name = this.inputView.input.getModel().getText().trim();
        }

        if (this.groupChanged && this.selectedProject.group !== this.groupSelect.select.value.replace('option-', '')) {
            editedProject.group = this.groupSelect.select.value.replace('option-', '');
        }

        newPaths = false;
        paths = [];
        currentPaths = Object.keys(this.selectedProject.paths);
        for (pathsIdx = 0; pathsIdx < this.pathsContainer.select.options.length; pathsIdx++) {
            let newPath = this.pathsContainer.select.options[pathsIdx].textContent;
            if (currentPaths.indexOf(newPath) === -1) {
                newPaths = true;
            }
            paths.push(newPath);
        }

        if (!paths.length) {
            return false;
        }

        if (newPaths || paths.length !== currentPaths.length) {
            editedProject.paths = paths;
        }

        if (!Object.keys(editedProject).length) {
            return true;
        }

        DataBase.file.emitter.emit(Constants.events.update, {
            type: 'projects',
            action: 'edit',
            object: this.selectedProject,
            edited: editedProject
        });
        return true;
    }
}

module.exports = document.registerElement(
    'edit-project-view',
    {
        prototype: EditProjectView.prototype,
        extends: 'div'
    }
);
