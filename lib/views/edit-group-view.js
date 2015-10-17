'use strict';

const Constants = require('./../helpers/constants');
const DataBase = require('./../helpers/database');

const InputSelectionView = require('./input-view');
const IconSelectionView = require('./icon-selection-view');

class EditGroupView extends HTMLElement {

    // native
    createdCallback() {
        this.classList.add('block', 'from-top');
        this.modalTitle = document.createElement('h3');
        this.modalTitle.textContent = Constants.groups.topicEdit;

        this.inputView = new InputSelectionView();
        this.inputView.setDescription(Constants.groups.groupName);

        this.iconSelect = new IconSelectionView();
        this.iconSelect.setDescription(Constants.groups.selectIcon);

        this.separator = document.createElement('hr');

        this.editButton = document.createElement('button');
        this.editButton.classList.add('inline-block', 'btn', 'btn-warning', 'icon', 'icon-alert');
        this.editButton.textContent = Constants.groups.buttons.edit;
        this.editButton.addEventListener(Constants.events.click, function addButtonClick(event) {
            event.stopPropagation();
            if (this.parentElement.editGroup()) {
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
        this.appendChild(this.inputView);
        this.appendChild(this.iconSelect);
        this.appendChild(this.separator);
        this.appendChild(this.editButton);
        this.appendChild(this.cancelButton);
    }

    attachedCallback() {}

    detachedCallback() {}

    // custom
    editGroup() {
        let group = {};
        group.name = this.inputView.input.value;
        if (this.iconSelect.getSelectedIcon().length > 0) {
            group.icon = this.iconSelect.select.value;
        }
        DataBase.file.emitter.emit('updated', {type: 'groups', action: 'edit', object: group});
        return true;
    }

    openModal() {
        this.modal = atom.workspace.addModalPanel({
            item: this,
            visible: true
        });
    }

    closeModal() {
        this.modal.destroy();
    }
}

module.exports = EditGroupView;

module.exports = document.registerElement(
    'edit-group-view',
    {
        prototype: EditGroupView.prototype,
        extends: 'div'
    }
);
