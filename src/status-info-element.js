'use strict';

class StatusInfoElement extends HTMLElement {

    createdCallback () {
        let errorsIcon = document.createElement('span'),
            errorsCounter = document.createElement('span'),
            warningsIcon = document.createElement('span'),
            warningsCounter = document.createElement('span');
        errorsIcon.classList.add('icon', 'icon-alert', 'text-error');
        errorsCounter.classList.add('badge', 'badge-small');
        errorsCounter.textContent = 0;
        warningsIcon.classList.add('icon', 'icon-alert', 'text-warning');
        warningsCounter.classList.add('badge', 'badge-small');
        warningsCounter.textContent = 0;
        this.appendChild(errorsIcon);
        this.appendChild(errorsCounter);
        this.appendChild(warningsIcon);
        this.appendChild(warningsCounter);
    }

    attachedCallback () {}

    detachedCallback () {}

    initialize (model) {
        if (!model) {
            return;
        }
        this.model = model;

        return this;
    }
}

module.exports = document.registerElement(
    'pv-status-info',
    {
        prototype: StatusInfoElement.prototype
    }
);
