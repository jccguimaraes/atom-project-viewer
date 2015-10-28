(function () {
    'use strict';

    class GroupSelectionElement extends HTMLElement {
        createdCallback () {
            this.appendChild(this.descriptionComponent());
        }

        attachedCallback () {}

        detachedCallback () {}

        initialize (model) {
            this.model = model;
            return this;
        }

        components () {
            let components = {};
            return {
                get: function (value) {
                    return components.hasOwnProperty(value) ? components[value] : null;
                },
                set: function (value, key) {
                    if (!components.hasOwnProperty(value)) {
                        components[value] = key;
                    }
                }
            };
        }

        descriptionComponent () {
            let component = document.createElement('h3');
            return component;
        }
    }

    module.exports = document.registerElement(
        'group-selection',
        {
            prototype: GroupSelectionElement.prototype,
            extends: 'div'
        }
    );
})();
