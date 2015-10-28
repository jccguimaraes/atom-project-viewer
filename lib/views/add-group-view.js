'use strict';

const Constants = require('./../helpers/constants'),
    DataBase = require('./../helpers/database'),
    InputSelectionView = require('./input-view'),
    IconSelectionView = require('./icon-selection-view');

class AddGroupView extends HTMLElement {

    // native
    createdCallback () {
        this.classList.add('block', 'from-top');
        this.modalTitle = document.createElement('h3');
        this.modalTitle.textContent = Constants.groups.topicAdd;

        this.inputView = new InputSelectionView();
        this.inputView.setDescription(Constants.groups.groupName);

        this.iconSelect = new IconSelectionView();
        this.iconSelect.setDescription(Constants.groups.selectIcon);

        this.separator = document.createElement('hr');

        this.addButton = document.createElement('button');
        this.addButton.classList.add('inline-block', 'btn', 'btn-success', 'icon', 'icon-check');
        this.addButton.textContent = Constants.groups.buttons.add;
        this.addButton.addEventListener(Constants.events.click, function addButtonClick(event) {
            event.stopPropagation();
            if (this.parentElement.constructGroup()) {
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
        this.appendChild(this.addButton);
        this.appendChild(this.cancelButton);
    }

    attachedCallback () {}

    detachedCallback () {}

    // custom
    constructGroup () {
        let group = {};
        group.name = this.inputView.querySelector('* /deep/ .text').textContent;
        if (this.iconSelect.getSelectedIcon().length > 0) {
            group.icon = this.iconSelect.select.value;
        }
        DataBase.file.emitter.emit(Constants.events.update, {type: 'groups', action: 'add', object: group});
        return true;
    }

    openModal () {
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
    'add-group-view',
    {
        prototype: AddGroupView.prototype,
        extends: 'div'
    }
);
