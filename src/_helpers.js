'use strict';

const evaluator = function _evaluator (model, options) {
  if (options && options.hasOwnProperty('byProperty')) {
    return model[options.byProperty];
  }
  if (model === String(model)) {
    return model;
  }
  if (typeof model.sorting === 'function') {
    return model.sorting();
  }
  if (model instanceof HTMLElement) {
    return model.textContent;
  }
  return '';
}

const sortArray = function _sortArray (list, options) {
  if (!list) {
    return undefined;
  }

  if (!Array.isArray(list)) {
    return null;
  }

  let reversed = 1;

  if (options && options.hasOwnProperty('reversed')) {
    reversed = options.reversed ? -1 : 1;
  }

  return list.sort(function (current, next) {
    return (reversed * new Intl.Collator().compare(
        evaluator(current, options),
        evaluator(next, options)
    ));
  })
};

const castToArray = function _castToArray (whatever) {
  return Array.apply(null, whatever);
}

/**
* Helpers.
* @module project-viewer/helpers
*/

module.exports = {
  /** sorts an array */
  sortArray,

  /** turn an array like to an actual array */
  castToArray
};
