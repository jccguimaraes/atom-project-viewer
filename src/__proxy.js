'use strict';

const group = {
  name: '',
  sortBy: 'position',
  icon: '',
  color: null
};

const handler = {
  setPrototypeOf: function _setPrototypeOf (target, prototype) {
    return Object.getPrototypeOf(target) === Object.getPrototypeOf(prototype);
  },
  get: function _get (target, property) {
    if (target.hasOwnProperty(property)) {
      return target[property];
    }
    return null;
  },
  set: function _set (target, property, value, receiver) {
    const allowedProps = [
      'name',
      'sortBy',
      'icon',
      'color'
    ];
    if (allowedProps.indexOf(property) === -1) {
      return true;
    }
    let cleanValue;
    if (property === 'name') {
      // TODO: improve validation, current is weak...
      cleanValue = Number(value) !== value ? value : target[property];
    }
    else if (property === 'sortBy') {
      const allowed = [
        'position',
        'reverse-position',
        'alphabetically',
        'reverse-alphabetically'
      ];
      cleanValue = allowed.indexOf(value) !== -1 ? value : target[property];
    }
    else if (property === 'icon') {
      const allowed = [
        'icon-',
        'devicon-'
      ];
      cleanValue = allowed.map(
        (val) => value.startsWith(val) ? value : undefined
      ).filter(
        (val) => val !== undefined
      );

      cleanValue = cleanValue.length === 1 ? cleanValue[0] : target[property];
    }
    else if (property === 'color') {
      const regEx = new RegExp('^#(?:[0-9a-f]{3}){1,2}$', 'i');
      cleanValue = regEx.exec(value) !== null ? value : target[property];
    }
    target[property] = cleanValue;
    return true;
  }
};

module.exports = {
  createModel: function _createModel () {
    return new Proxy(Object.create(group), handler);
  }
};
