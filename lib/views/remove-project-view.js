'use strict';

// models
const Constants = require('./../helpers/constants'),
    DataBase = require('./../helpers/database'),
// views
    GroupSelectionView = require('./group-selection-view');

class RemoveProjectView extends HTMLElement {

    // native
    createdCallback () {
        this.classList.add('block', 'from-top');
        this.modalTitle = document.createElement('h3');
        this.modalTitle.textContent = Constants.projects.topicRemove;

        this.projectSelect = new GroupSelectionView();
        this.projectSelect.setDescription(Constants.projects.deleteProject);
        this.projectSelect.setGroups(DataBase.data.projects);

        this.separator = document.createElement('hr');

        this.removeButton = document.createElement('button');
        this.removeButton.classList.add('inline-block', 'btn', 'btn-error', 'icon', 'icon-alert');
        this.removeButton.textContent = Constants.projects.buttons.remove;
        this.removeButton.addEventListener(Constants.events.click, function removeButtonClick(event) {
            event.stopPropagation();
            if (this.parentElement.removeProject()) {
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
        this.appendChild(this.projectSelect);
        this.appendChild(this.separator);
        this.appendChild(this.removeButton);
        this.appendChild(this.cancelButton);
    }

    attachedCallback () {}

    detachedCallback () {}

    // custom
    removeProject () {
        let project = {};
        project.name = this.projectSelect.select.value.split('option-')[1];
        project.group = this.projectSelect.select.selectedOptions[0].getAttribute('data-group');
        DataBase.file.emitter.emit(Constants.events.update, {type: 'projects', action: 'remove', object: project});
        return true;
    }

    setDefaultProject (group) {
        if (!group || !group.name) {
            return;
        }
        this.hasDefaultGroup = group;
    }

    openModal () {
        if (this.hasDefaultGroup && this.hasDefaultGroup.name) {
            this.projectSelect.setDefaultGroup(this.hasDefaultGroup);
        }
        this.modal = atom.workspace.addModalPanel({
            item: this,
            visible: true
        });
    }

    closeModal () {
        this.modal.destroy();
    }
}

module.exports = document.registerElement(
    'remove-project-view',
    {
        prototype: RemoveProjectView.prototype,
        extends: 'div'
    }
);
