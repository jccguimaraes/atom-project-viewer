'use strict';

const Constants = require('./../helpers/constants');

class PathsSelectionView extends HTMLElement {

    // native
    createdCallback () {
        this.classList.add('block');

        this.pathsSelection = document.createElement('div');
        this.pathsSelection.classList.add('block');
        this.description = document.createElement('label');
        this.description.textContent = Constants.paths.topic;
        this.select = document.createElement('select');
        this.select.classList.add('form-control');
        this.addButton = document.createElement('button');
        this.addButton.textContent = Constants.paths.buttons.add;
        this.addButton.classList.add('inline-block', 'btn', 'btn-primary', 'inline-block');
        this.addButton.addEventListener('click', function addButtonClicked(event) {
            event.stopPropagation();
            this.parentElement.addPaths();
        });
        this.removeButton = document.createElement('button');
        this.removeButton.textContent = Constants.paths.buttons.remove;
        this.removeButton.classList.add('inline-block', 'btn', 'btn-error', 'icon', 'icon-alert');
        this.removeButton.addEventListener('click', function removeButtonClicked(event) {
            event.stopPropagation();
            this.parentElement.removePath();
        });

        this.appendChild(this.pathsSelection);
        this.pathsSelection.appendChild(this.description);
        this.pathsSelection.appendChild(this.select);
        this.appendChild(this.addButton);
        this.appendChild(this.removeButton);
    }

    attachedCallback () {}

    detachedCallback () {}

    setPaths (paths) {
        let currentPaths,
            alreadyHas,
            i,
            option;

        if (!paths || !paths.length) {
            return;
        }

        currentPaths = this.select.options;

        function forEachPath(path) {
            alreadyHas = false;
            for (i = 0; i < currentPaths.length; i++) {
                if (currentPaths[i].textContent === path) {
                    alreadyHas = true;
                    break;
                }
            }
            if (alreadyHas) {
                return;
            }
            option = document.createElement('option');
            option.textContent = path;
            this.select.appendChild(option);
            option.value = 'option-' + (this.select.length - 1);
        }

        paths.forEach(forEachPath, this);
    }

    addPaths () {
        let self = this;
        function pickedFolders(folders) {
            self.setPaths(folders);
        }
        atom.pickFolder(pickedFolders);
    }

    removePath () {
        let selection = this.select.value;
        if (selection) {
            this.select.options.remove(Number(selection.split('option-')[1]));
        }
    }

    // custom
}

module.exports = document.registerElement(
    'paths-selection-view',
    {
        prototype: PathsSelectionView.prototype,
        extends: 'div'
    }
);
