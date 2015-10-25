'use strict';

class InputSelectionView extends HTMLElement {

    // native
    createdCallback () {
        this.classList.add('block');
        this.description = document.createElement('label');

        this.appendChild(this.description);

        this.input = document.createElement('atom-text-editor');
        this.input.setAttribute('mini', '');
        this.appendChild(this.input);
    }

    attachedCallback () {}

    detachedCallback () {}

    // custom
    setDescription (description) {
        this.description.textContent = description;
    }

    setDefault (defaultInput) {
        this.input.textContent = defaultInput;
    }

    setInputText (text) {
        this.input.getModel().setText(text);
    }

    getInputText () {
        return this.input.getModel().getText();
    }

}

module.exports = document.registerElement(
    'input-selection-view',
    {
        prototype: InputSelectionView.prototype,
        extends: 'div'
    }
);
