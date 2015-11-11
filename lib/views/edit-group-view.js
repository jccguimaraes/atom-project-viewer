'use strict';

const Constants = require('./../helpers/constants'),
    DataBase = require('./../helpers/database'),
    GroupSelectionView = require('./group-selection-view'),
    InputSelectionView = require('./input-view'),
    IconSelectionView = require('./icon-selection-view');

class EditGroupView extends HTMLElement {

    // native
    createdCallback () {
        let self = this;

        this.classList.add('block', 'from-top');
        this.modalTitle = document.createElement('h3');
        this.modalTitle.textContent = Constants.groups.topicEdit;

        this.groupSelect = new GroupSelectionView();
        this.groupSelect.setDescription(Constants.projects.groupSelect);
        this.groupSelect.setGroups(DataBase.data.groups);
        this.groupSelect.select.addEventListener('change', function addButtonClick(event) {
            event.stopPropagation();
            let groupName = event.target.value.replace('option-', '');
            let selectedGroup = DataBase.data.groups.filter(function filterSelectedGroup(group) {
                return group.name === this.name;
            }, {name: groupName});
            self.setGroup(selectedGroup);
        });

        this.inputView = new InputSelectionView();
        this.inputView.setDescription(Constants.groups.groupName);

        self.iconChanged = false;
        this.iconSelect = new IconSelectionView();
        this.iconSelect.setDescription(Constants.groups.selectIcon);
        this.iconSelect.select.addEventListener('change', function iconSelectChange() {
            self.iconChanged = true;
        });

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

        self.colorChanged = false;
        this.colorBlock = document.createElement('div');
        this.colorBlock.classList.add('block');
        this.colorDescription = document.createElement('label');
        this.colorDescription.textContent = 'Choose color for group (optional):';
        this.inputColor = document.createElement('input');
        this.inputColor.setAttribute('type', 'color');
        this.inputColor.addEventListener('change', function () {
            self.colorChanged = true;
        });

        this.colorBlock.appendChild(this.colorDescription);
        this.colorBlock.appendChild(this.inputColor);

        this.appendChild(this.modalTitle);
        this.appendChild(this.groupSelect);
        this.appendChild(this.inputView);
        this.appendChild(this.iconSelect);
        this.appendChild(this.colorBlock);
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

    inputSetText (groupName) {
        this.inputView.input.getModel().setText(groupName);
    }

    setIcon (icon) {
        this.iconSelect.setSelectedIcon(icon);
    }

    setColor (color) {
        this.inputColor.value = color;
    }

    setGroup (group) {
        this.selectedGroup = group;
        this.groupSelect.setDefaultGroup(group);
        this.setIcon(group.icon);
        this.inputSetText(group.name);
        this.setColor(group.color);
    }

    editGroup () {
        let editedGroup;

        editedGroup = {};

        if (this.selectedGroup.name !== this.inputView.input.getModel().getText()) {
            editedGroup.name = this.inputView.input.getModel().getText();
        }

        if (this.iconChanged) {
            editedGroup.icon = this.iconSelect.select.value;
        }

        if (this.colorChanged) {
            editedGroup.color = this.inputColor.value;
        }

        if (!Object.keys(editedGroup).length) {
            return true;
        }

        DataBase.file.emitter.emit(Constants.events.update, {
            type: 'groups',
            action: 'edit',
            object: this.selectedGroup,
            edited: editedGroup
        });
        return true;
    }
}

module.exports = document.registerElement(
    'edit-group-view',
    {
        prototype: EditGroupView.prototype,
        extends: 'div'
    }
);
