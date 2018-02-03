// =============================================================================
// requires
// =============================================================================

// =============================================================================
// properties
// =============================================================================

const mapper = {};

// =============================================================================
// methods
// =============================================================================

/**
 * Initializes a stylesheet specific for project-viewer
 * @public
 * @since 1.0.0
 */
const initialize = function _initialize () {
  if (!mapper.element) {
    mapper.element = document.createElement('style');
    document.querySelector('head atom-styles')
      .appendChild(mapper.element);
    atom.styles.addStyleElement(mapper.element);
    mapper.element.setAttribute('source-path', 'project-viewer-styles');
    mapper.element.setAttribute('priority', 3);
  }
  mapper.selectorTexts = {};
  mapper.rules = {};
};

/**
 * Destroys the stylesheet created and removes it from the DOM
 * @public
 * @since 1.0.0
 */
const destroy = function _destroy () {
  if (mapper.element) {
    mapper.element.remove();
  }
  delete mapper.element;
  delete mapper.selectorTexts;
  delete mapper.rules;
};

/**
 *
 * @public
 * @since 1.0.0
 */
const addRule = function _addRule (itemId, type, value) {
  if (!itemId) { return; }
  if (!mapper.element || !mapper.element.sheet) { return; }

  if (!value) {
    delete mapper.rules[itemId];
    return;
  }

  let selectorText;
  let rule;

  switch (type) {
    case 'app':
      selectorText = `project-viewer, project-viewer.autohide:hover`;
      rule = `${selectorText} { width: ${value}px}`;
      break;
    case 'hotzone':
      selectorText = 'project-viewer.autohide';
      rule = `${selectorText} { width: ${value}px}`;
      break;
    case 'group':
      selectorText = `project-viewer .list-tree.has-collapsable-children.pv-has-custom-icons li[data-project-viewer-uuid="${itemId}"] .list-item`;
      rule = `${selectorText} { color: ${value}}`;
      break;
    case 'project':
      selectorText = `project-viewer .list-tree.has-collapsable-children.pv-has-custom-icons li[data-project-viewer-uuid="${itemId}"].list-item`;
      rule = `${selectorText} { color: ${value}}`;
      break;
    case 'project-hover':
      selectorText = `project-viewer .list-tree.has-collapsable-children.pv-has-custom-icons li.list-item:hover, project-viewer .list-tree.has-collapsable-children.pv-has-custom-icons li .list-item:hover`
      rule = `${selectorText} { color: ${value}}`;
      break;
    case 'project-hover-before':
      selectorText = `project-viewer .list-tree.has-collapsable-children.pv-has-custom-icons li.list-item:not(.selected)::before`
      rule = `${selectorText} { background-color: ${value}}`;
      break;
    case 'project-selected':
      selectorText = `project-viewer .list-tree.has-collapsable-children.pv-has-custom-icons li.list-item.selected`
      rule = `${selectorText} { color: ${value}}`;
      break;
    case 'title':
      selectorText = `project-viewer .heading`;
      rule = `${selectorText} { color: ${value}}`;
      break;
  }

  mapper.selectorTexts[itemId] = selectorText;

  if (mapper.rules[itemId]) {
    this.removeRule(itemId);
  }
  mapper.rules[itemId] = rule;

  mapper.element.sheet.insertRule(
    rule,
    mapper.element.sheet.cssRules.length
  );
};

/**
 *
 * @public
 * @since 1.0.0
 */
const removeRule = function _removeRule (itemId) {

  if (!mapper || !mapper.selectorTexts) { return; }

  const selectorText = mapper.selectorTexts[itemId];

  if (!selectorText) { return; }

  Array.from(mapper.element.sheet.cssRules).forEach(
    function (cssRule, idx) {
      if (cssRule.selectorText ===  selectorText) {
        if (mapper.element && mapper.element.sheet) {
          mapper.element.sheet.deleteRule(idx);
        }
        mapper.selectorTexts[itemId];
        mapper.rules[itemId];
      }
    }
  );
};

// =============================================================================
// instantiation
// =============================================================================

const colours = {
  // properties
  mapper,
  // privates
  // publics
  initialize,
  destroy,
  addRule,
  removeRule
};

/**
 * colours module
 * @module database
 */
module.exports = colours;
