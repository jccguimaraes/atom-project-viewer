'use strict';

class GroupSelectionView extends HTMLElement {

    // native
    createdCallback() {
        this.classList.add('block');
        this.description = document.createElement('label');
        this.select = document.createElement('select');
        this.select.classList.add('form-control');
        this.appendChild(this.description);
        this.appendChild(this.select);
    }

    attachedCallback() {}

    detachedCallback() {}

    // custom
    setDescription(description) {
        this.description.textContent = description;
    }

    setGroups(groups) {
        if (!groups || !groups.length) {
            return;
        }

        function forEachGroup(group, groupIndex) {
            let option;
            option = document.createElement('option');
            option.value = 'option-' + group.name;
            option.textContent = group.name;
            this.select.appendChild(option);
        }

        groups.forEach(forEachGroup, this);
    }

    getSelectedGroup() {
        return this.select.value;
    }

    setDefaultGroup(group) {
        if (!group || !group.name) {
            return;
        }
        this.select.value = 'option-' + group.name;
    }
}

module.exports = GroupSelectionView;

module.exports = document.registerElement(
    'group-selection-view',
    {
        prototype: GroupSelectionView.prototype,
        extends: 'div'
    }
);
