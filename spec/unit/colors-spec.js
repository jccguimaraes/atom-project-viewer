'use strict';

const wm = new WeakMap();

const sheet = {};

sheet.initialize = function _initialize () {
    if (wm.get(this)) {
        return undefined;
    }

    const colorsObject = {
        element: document.createElement('style'),
        rules: {
            project: {},
            group: {},
            client: {}
        }
    };
    document.querySelector('head atom-styles').appendChild(colorsObject.element);
    atom.styles.addStyleElement(colorsObject.element);
    colorsObject.element.setAttribute('source-path', 'project-viewer-styles');
    colorsObject.element.setAttribute('priority', 3);

    wm.set(this, colorsObject);

    return colorsObject;
};

sheet.destroy = function _destroy () {
    if (wm.get(this)) {
        wm.delete(this);
        return undefined;
    }

    return null;
};

sheet.setRule = function _setRule (itemId, itemType, color) {
    const colorsObject = wm.get(this);

    if (!colorsObject) {
        return undefined;
    }

    while (colorsObject.element.sheet.cssRules.length > 0) {
        colorsObject.element.sheet.deleteRule(colorsObject.element.sheet.cssRules.length - 1);
    }

    let selectorText;
    let rule;

    if (itemId) {
        // selectorText = `#${itemId} .list-item span`;
        selectorText = `#${itemId} .list-item`;
    } else {
        return;
    }

    if (color) {
        rule = `${selectorText} { color: ${color}}`;

        colorsObject.rules[itemType][itemId] = rule;
    }
    else {
        delete colorsObject.rules[itemType][itemId];
    }

    Object.keys(colorsObject.rules.client).forEach(
        (client, idx) => colorsObject.element.sheet.insertRule(
            colorsObject.rules.client[client],
            colorsObject.element.sheet.cssRules.length
        )
    );

    Object.keys(colorsObject.rules.group).forEach(
        (group, idx) => colorsObject.element.sheet.insertRule(
            colorsObject.rules.group[group],
            colorsObject.element.sheet.cssRules.length
        )
    );

    Object.keys(colorsObject.rules.project).forEach(
        (project, idx) => colorsObject.element.sheet.insertRule(
            colorsObject.rules.project[project],
            colorsObject.element.sheet.cssRules.length
        )
    );
};

module.exports = sheet;
