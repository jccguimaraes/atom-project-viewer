'use strict';

// models
const Constants = require('./../helpers/constants'),
    DataBase = require('./../helpers/database'),
// views
    GroupSelectionView = require('./group-selection-view');

class RemoveGroupView extends HTMLElement {

    // native
    createdCallback () {
        this.classList.add('block', 'from-top');
        this.modalTitle = document.createElement('h3');
        this.modalTitle.textContent = Constants.groups.topicRemove;

        this.groupSelect = new GroupSelectionView();
        this.groupSelect.setDescription(Constants.groups.deleteGroup);
        this.groupSelect.setGroups(DataBase.data.groups);

        this.separator = document.createElement('hr');

        this.removeButton = document.createElement('button');
        this.removeButton.classList.add('inline-block', 'btn', 'btn-error', 'icon', 'icon-alert');
        this.removeButton.textContent = Constants.groups.buttons.remove;
        this.removeButton.addEventListener(Constants.events.click, function removeButtonClick(event) {
            event.stopPropagation();
            if (this.parentElement.removeGroup()) {
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
        this.appendChild(this.groupSelect);
        this.appendChild(this.separator);
        this.appendChild(this.removeButton);
        this.appendChild(this.cancelButton);
    }

    attachedCallback () {}

    detachedCallback () {}

    // custom
    removeGroup () {
        let group = {};
        group.name = this.groupSelect.select.value.split('option-')[1];
        DataBase.file.emitter.emit(Constants.events.update, {type: 'groups', action: 'remove', object: group});
        return true;
    }

    setDefaultGroup (group) {
        if (!group || !group.name) {
            return;
        }
        this.hasDefaultGroup = group;
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
}

module.exports = document.registerElement(
    'remove-group-view',
    {
        prototype: RemoveGroupView.prototype,
        extends: 'div'
    }
);
