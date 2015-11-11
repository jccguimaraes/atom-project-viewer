'use strict';

const Constants = require('./../helpers/constants'),
    Path = require('path');

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

    resetPaths () {
        this.select.innerHTML = '';
    }

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

            let editor = this.parentElement.inputView.input.getModel();
            if (editor.getText() === '') {
                editor.setText(Path.basename(path));
            }
        }

        paths.forEach(forEachPath, this);
    }

    getPaths () {
        return this.select.options;
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
        if (selection !== -1) {
            this.select.removeChild(this.select.options[this.select.options.selectedIndex]);
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
