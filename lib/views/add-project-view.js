'use strict';

const Constants = require('./../helpers/constants'),
    DataBase = require('./../helpers/database'),
    InputSelectionView = require('./input-view'),
    GroupSelectionView = require('./group-selection-view'),
    PathsSelectionView = require('./paths-selection-view');

class AddProjectView extends HTMLElement {

    // native
    createdCallback () {

        this.classList.add('block', 'from-top');
        this.modalTitle = document.createElement('h3');
        this.modalTitle.textContent = Constants.projects.topicAdd;

        this.inputView = new InputSelectionView();
        this.inputView.setDescription(Constants.projects.nameInput);

        this.groupSelect = new GroupSelectionView();
        this.groupSelect.setDescription(Constants.projects.groupSelect);
        this.groupSelect.setGroups(DataBase.data.groups);

        this.pathsContainer = new PathsSelectionView();

        this.separator = document.createElement('hr');

        this.addButton = document.createElement('button');
        this.addButton.classList.add('inline-block', 'btn', 'btn-success', 'icon', 'icon-check');
        this.addButton.textContent = Constants.projects.buttons.add;
        this.addButton.addEventListener(Constants.events.click, function addButtonClick(event) {
            event.stopPropagation();
            if (this.parentElement.constructProject()) {
                this.parentElement.closeModal();
            }
        });

        this.cancelButton = document.createElement('button');
        this.cancelButton.classList.add('inline-block', 'btn');
        this.cancelButton.textContent = Constants.projects.buttons.cancel;
        this.cancelButton.addEventListener(Constants.events.click, function cancelButtonClick(event) {
            event.stopPropagation();
            this.parentElement.closeModal();
        });

        this.appendChild(this.modalTitle);
        this.appendChild(this.inputView);
        this.appendChild(this.groupSelect);
        this.appendChild(this.pathsContainer);
        this.appendChild(this.separator);
        this.appendChild(this.addButton);
        this.appendChild(this.cancelButton);
    }

    attachedCallback () {}

    detachedCallback () {}

    // custom
    constructProject () {
        let already,
            project,
            i;

        project = {};
        project.name = this.inputView.input.getModel().getText().trim();
        project.group = this.groupSelect.select.selectedOptions[0].textContent;
        project.paths = [];
        for (i = 0; i < this.pathsContainer.select.options.length; i++) {
            project.paths.push(this.pathsContainer.select.options[i].textContent);
        }

        already = DataBase.data.projects.some(function someProjects(project) {
            return (this.name === project.name) && (this.group === project.group);
        }, project);


        if (already || !project.name.length || !project.paths.length) {
            return false;
        }

        DataBase.file.emitter.emit(Constants.events.update, {type: 'projects', action: 'add', object: project});
        return true;
    }

    openModal () {
        if (this.hasDefaultGroup && this.hasDefaultGroup.name) {
            this.groupSelect.setDefaultGroup(this.hasDefaultGroup);
        }
        this.modal = atom.workspace.addModalPanel({
            item: this,
            visible: true
        });
    }

    closeModal () {
        this.modal.destroy();
    }

    setDefaultGroup (group) {
        if (!group || !group.name) {
            return;
        }
        this.hasDefaultGroup = group;
    }
}

module.exports = document.registerElement(
    'add-project-view',
    {
        prototype: AddProjectView.prototype,
        extends: 'div'
    }
);
