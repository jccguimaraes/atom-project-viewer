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

    let selectorText;
    let rule;

    if (!itemId) { return; }

    selectorText = `project-viewer #${itemId} .list-item span`;

    Array.from(colorsObject.element.sheet.cssRules).forEach(function (cssRule, idx) {
        if (cssRule.selectorText ===  selectorText) {
            colorsObject.element.sheet.deleteRule(idx);
        }
    });

    if (!color) {
        delete colorsObject.rules[itemType][itemId];
        return;
    }

    rule = `${selectorText} { color: ${color}}`;
    colorsObject.rules[itemType][itemId] = rule;
    colorsObject.element.sheet.insertRule(
      rule,
      colorsObject.element.sheet.cssRules.length
    );
};

sheet.setSelectedColor = function _setSelectedColor (color) {
    const colorsObject = wm.get(this);

    if (!colorsObject) {
        return undefined;
    }

    let selectorText = `project-viewer li[is="pv-list-item"].list-item.active.selected span`;
    let rule = `${selectorText} { color: ${color} !important}`;

    Array.from(colorsObject.element.sheet.cssRules).forEach(function (cssRule, idx) {
        if (cssRule.selectorText ===  selectorText) {
            colorsObject.element.sheet.deleteRule(idx);
        }
    });

    colorsObject.element.sheet.insertRule(
      rule,
      colorsObject.element.sheet.cssRules.length
    );
    colorsObject.rules.selected = rule;
};

sheet.unsetSelectedColor = function _unsetSelectedColor () {
    const colorsObject = wm.get(this);

    if (!colorsObject) {
        return undefined;
    }

    let selectorText = `project-viewer li[is="pv-list-item"].list-item.active.selected span`;

    Array.from(colorsObject.element.sheet.cssRules).forEach(function (cssRule, idx) {
        if (cssRule.selectorText ===  selectorText) {
            colorsObject.element.sheet.deleteRule(idx);
            delete colorsObject.rules.selected;
        }
    });
};

sheet.setHoverColor = function _setHoverColor (color) {
    const colorsObject = wm.get(this);

    if (!colorsObject) {
        return undefined;
    }

    let selectorBeforeText = `project-viewer li[is="pv-list-item"].list-item::before`;
    let selectorBeforeSelectedText = `project-viewer li[is="pv-list-item"].list-item:hover span`;
    const ruleBefore = `${selectorBeforeText} { background-color: ${color} !important}`;
    const ruleBeforeSelected = `${selectorBeforeSelectedText} { color: ${color} !important}`;

    Array.from(colorsObject.element.sheet.cssRules).forEach(function (cssRule, idx) {
        if (cssRule.selectorText ===  selectorBeforeText) {
            colorsObject.element.sheet.deleteRule(idx);
        }
    });

    Array.from(colorsObject.element.sheet.cssRules).forEach(function (cssRule, idx) {
        if (cssRule.selectorText ===  selectorBeforeSelectedText) {
            colorsObject.element.sheet.deleteRule(idx);
        }
    });

    colorsObject.element.sheet.insertRule(
      ruleBefore,
      colorsObject.element.sheet.cssRules.length
    );
    colorsObject.rules.before = ruleBefore;

    colorsObject.element.sheet.insertRule(
      ruleBeforeSelected,
      colorsObject.element.sheet.cssRules.length
    );
    colorsObject.rules.beforeSelected = ruleBeforeSelected;
};

sheet.unsetHoverColor = function _unsetHoverColor () {
    const colorsObject = wm.get(this);

    if (!colorsObject) {
        return undefined;
    }

    let selectorBeforeText = `project-viewer li[is="pv-list-item"].list-item::before`;
    let selectorBeforeSelectedText = `project-viewer li[is="pv-list-item"].list-item:hover span`;

    Array.from(colorsObject.element.sheet.cssRules).forEach(function (cssRule, idx) {
        if (cssRule.selectorText ===  selectorBeforeText) {
            colorsObject.element.sheet.deleteRule(idx);
            delete colorsObject.rules.before;
        }
    });

    Array.from(colorsObject.element.sheet.cssRules).forEach(function (cssRule, idx) {
        if (cssRule.selectorText ===  selectorBeforeSelectedText) {
            colorsObject.element.sheet.deleteRule(idx);
            delete colorsObject.rules.beforeSelected;
        }
    });
};

sheet.setTitleColor = function _setTitleColor (color) {
    const colorsObject = wm.get(this);

    if (!colorsObject) {
        return undefined;
    }

    let selectorText = `project-viewer pv-header`;
    let rule = `${selectorText} { color: ${color} !important}`;

    Array.from(colorsObject.element.sheet.cssRules).forEach(function (cssRule, idx) {
        if (cssRule.selectorText ===  selectorText) {
            colorsObject.element.sheet.deleteRule(idx);
        }
    });

    colorsObject.element.sheet.insertRule(
      rule,
      colorsObject.element.sheet.cssRules.length
    );
    colorsObject.rules.title = rule;
};

sheet.unsetTitleColor = function _unsetTitleColor () {
    const colorsObject = wm.get(this);

    if (!colorsObject) {
        return undefined;
    }

    let selectorText = `project-viewer pv-header`;

    Array.from(colorsObject.element.sheet.cssRules).forEach(function (cssRule, idx) {
        if (cssRule.selectorText ===  selectorText) {
            colorsObject.element.sheet.deleteRule(idx);
            delete colorsObject.rules.title;
        }
    });
};

sheet.setRules = function _setRules (obj) {
  if (obj.rules.title) {
    obj.element.sheet.insertRule(
        obj.rules.title,
        obj.element.sheet.cssRules.length
    )
  }
  if (obj.rules.selected) {
    obj.element.sheet.insertRule(
        obj.rules.selected,
        obj.element.sheet.cssRules.length
    )
  }
  if (obj.rules.hover) {
    obj.element.sheet.insertRule(
        obj.rules.hover,
        obj.element.sheet.cssRules.length
    )
  }
  if (obj.rules.before) {
    obj.element.sheet.insertRule(
        obj.rules.before,
        obj.element.sheet.cssRules.length
    )
  }
  if (obj.rules.beforeSelected) {
    obj.element.sheet.insertRule(
        obj.rules.beforeSelected,
        obj.element.sheet.cssRules.length
    )
  }
  Object.keys(obj.rules.client).forEach(
      (client, idx) => obj.element.sheet.insertRule(
          obj.rules.client[client],
          obj.element.sheet.cssRules.length
      )
  );

  Object.keys(obj.rules.group).forEach(
      (group, idx) => obj.element.sheet.insertRule(
          obj.rules.group[group],
          obj.element.sheet.cssRules.length
      )
  );

  Object.keys(obj.rules.project).forEach(
      (project, idx) => obj.element.sheet.insertRule(
          obj.rules.project[project],
          obj.element.sheet.cssRules.length
      )
  );
};

module.exports = sheet;
