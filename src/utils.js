'use strict';

const Notification = require('atom').Notification;

const methods = {
    sanitizeString: function sanitizeString (str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    },
    notification: function notification(type, title, options) {
        atom.notifications.addNotification(
            new Notification(
                type,
                `<strong>Project Viewer</strong><br>${title}`,
                options
            )
        );
    },
    selectedProject: function selectedProject() {
        return document.querySelector('project-viewer .active');
    },
    getStatusBar: function getStatusBar() {
        return document.querySelector('pv-status-bar');
    },
    updateSelectedProject: function updateSelectedProject() {
        let selected = methods.selectedProject();
        let statusBar = methods.getStatusBar();

        if (!selected) {
            return;
        }

        if (!statusBar) {
            return;
        }
    }
};

module.exports = methods;
