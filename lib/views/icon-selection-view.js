'use strict';

class IconSelectionView extends HTMLElement {

    // native
    createdCallback() {
        this.icons = [''];
        let regex = /icon-(\S[^\[\s*]*)(?=::before)/g;
        let styles = document.styleSheets;
        for(var i=0; i < styles.length; i++) {
            for(var j=0; j < styles[i].cssRules.length; j++) {
                if (styles[i].cssRules[j].selectorText) {
                    let icon;
                    while ((icon = regex.exec(styles[i].cssRules[j].selectorText)) !== null) {
                        if (icon.index === regex.lastIndex) {
                            regex.lastIndex++;
                        }
                        if (this.icons.indexOf(icon[0]) === -1) {
                            this.icons.push(icon[0]);
                        }
                    }
                }
            }
        }

        this.classList.add('block');
        this.description = document.createElement('label');
        this.select = document.createElement('select');
        this.select.classList.add('form-control');

        function forEachGroup(icon, iconIndex) {
            let option;
            option = document.createElement('option');
            option.value = icon;
            option.textContent = icon;
            this.select.appendChild(option);
        }

        this.icons.forEach(forEachGroup, this);

        this.appendChild(this.description);
        this.appendChild(this.select);
    }

    attachedCallback() {}

    detachedCallback() {}

    // custom
    setDescription(description) {
        this.description.textContent = description;
    }

    getSelectedIcon() {
        return this.select.value;
    }
}

module.exports = IconSelectionView;

module.exports = document.registerElement(
    'icon-selection-view',
    {
        prototype: IconSelectionView.prototype,
        extends: 'div'
    }
);
