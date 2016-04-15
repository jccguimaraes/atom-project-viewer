'use strict';

const Notification = require('atom').Notification;

const methods = {
    notification: function notification(type, title, options) {
        atom.notifications.addNotification(
            new Notification(
                type,
                `<strong>Project Viewer</strong><br>${title}`,
                options
            )
        );
    }
};

module.exports = methods;
