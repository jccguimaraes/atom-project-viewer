const map = require('./map');

const createView = function _createView (element, methods, model) {
  const tagExtends = element.tagExtends;
  const tagIs = element.tagIs;
  let view;
  let options = {};

  if (!tagIs) {
    return;
  }

  if (methods) {
    options.prototype = methods;
  }

  if (tagExtends) {
    options.extends = tagExtends;
  }

  try {
    const viewConstructor = document.registerElement(
      tagIs,
      options
    );
    Object.setPrototypeOf(methods, HTMLElement.prototype);
    view = new viewConstructor();
  } catch (e) {
    if (tagExtends) {
      view =  document.createElement(tagExtends, tagIs);
    }
    else {
      view =  document.createElement(tagIs);
    }
  }

  if (model) {
    map.set(view, model);
  }
  return view;
};

module.exports = {
  createView: createView
};
