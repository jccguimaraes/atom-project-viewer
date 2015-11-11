'use strict';

class IconSelectionView extends HTMLElement {

    // native
    createdCallback () {
        let regex,
            styles,
            i,
            j,
            icon;
        this.icons = [''];
        regex = /icon-(\S[^\[\s*]*)(?=::before)/g;
        styles = document.styleSheets;
        for (i = 0; i < styles.length; i++) {
            for (j = 0; j < styles[i].cssRules.length; j++) {
                if (styles[i].cssRules[j].selectorText) {
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

        function forEachGroup(icon) {
            let option;
            option = document.createElement('option');
            option.value = icon;
            option.textContent = icon;
            this.select.appendChild(option);
            this.select.addEventListener('change', function () {
                let element;
                element = this.parentElement.selectedIcon;
                if (element.classList.length > 3) {
                    element.classList.remove(element.classList[element.classList.length - 1]);
                }
                element.classList.add(this.value);
            });
        }

        this.icons.forEach(forEachGroup, this);

        this.selectedIcon = document.createElement('span');
        this.selectedIcon.classList.add('inline-block', 'icon', 'preview-icon');

        this.appendChild(this.description);
        this.appendChild(this.selectedIcon);
        this.appendChild(this.select);
    }

    attachedCallback () {}

    detachedCallback () {}

    // custom
    setDescription (description) {
        this.description.textContent = description;
    }

    getSelectedIcon () {
        return this.select.value;
    }

    setSelectedIcon (icon) {
        this.select.value = icon;
    }
}

module.exports = document.registerElement(
    'icon-selection-view',
    {
        prototype: IconSelectionView.prototype,
        extends: 'div'
    }
);
