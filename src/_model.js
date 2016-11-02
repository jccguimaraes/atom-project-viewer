'use strict';

const defaults = {
  name: 'unnamed',
  sortBy: 'position',
  icon: '',
  color: '',
  group: 0,
  project: 0,
  expanded: false,
  devMode: false
};

const groupModel = {
  type: 'group',
  name: defaults.name,
  sortBy: defaults.sortBy,
  icon: defaults.icon,
  color: defaults.color,
  expanded: defaults.expanded
};

const projectModel = {
  type: 'project',
  name: defaults.name,
  icon: defaults.icon,
  color: defaults.color,
  devMode: defaults.devMode
};

const methods = {
  breadcrumb: function _breadcrumb () {
    let proto = Object.getPrototypeOf(this);
    let protoName = '';
    if (proto !== Object.prototype) {
      protoName = proto.breadcrumb();
    }
    return protoName.length === 0 ? this.name : `${protoName} / ${this.name}`;
  }
};

const groupMethods = {};

const projectMethods = {
  clearPaths: function _clearPaths () {
    const removedPaths = this.paths.filter(
      () => true
    );
    this.paths.length = 0;
    return removedPaths;
  },
  addPaths: function _addPaths (paths) {
    if (!paths) {
      return;
    }
    if (Array.isArray(paths)) {
      paths.forEach(
        (path) => this.addPaths(path)
      );
      return;
    }
    if (typeof paths !== 'string') {
      return;
    }
    if (this.paths.indexOf(paths) === -1) {
      this.paths.push(paths);
    }
  },
  removePath: function _removePath (path) {
    const idx = this.paths.indexOf(path);
    if (idx === -1) {
      return;
    }
    this.paths.splice(idx, 1);
  },
  removePaths: function _removePaths (paths) {
    let idxsToRemove = [];
    this.paths.forEach(
      (path, idx) => {
        if (paths.indexOf(path) !== -1) {
          idxsToRemove.push(idx);
        }
      }
    );
    idxsToRemove.sort().reverse().forEach(
      (idxToRemove) => this.paths.splice(idxToRemove, 1)
    );
  }
};

Object.assign(groupMethods, methods);
Object.assign(projectMethods, methods);

const setPrototypeOf = function _setPrototypeOf (target, prototype) {
  if (
    (target.type === 'group' && target.type === prototype.type) ||
    (prototype.type === 'group' && target.type === 'project')
  ) {
    Object.setPrototypeOf(target, prototype);
    return true;
  }
  return false;
};

const handler = {
  setPrototypeOf: setPrototypeOf,
  get: function _get (target, property) {
    if (target.hasOwnProperty(property)) {
      return target[property];
    }
    if (typeof target[property] === 'function') {
      return target[property];
    }
    return null;
  },
  set: function _set (target, property, value) {
    const allowedProps = [
      'name',
      'sortBy',
      'expanded',
      'icon',
      'color',
      'devMode'
    ];
    if (allowedProps.indexOf(property) === -1) {
      return true;
    }
    let cleanValue;

    if (value === undefined) {
      target[property] = defaults[property];
      return true;
    }
    if (property === 'name') {
      // TODO: make this in a helper function?
      const UNSAFE_CHARS_PATTERN = /[<>\/\u2028\u2029]/g;
      const UNICODE_CHARS = {
        '<': '\\u003C',
        '>': '\\u003E',
        '/': '\\u002F',
        '\u2028': '\\u2028',
        '\u2029': '\\u2029'
      };
      cleanValue = value.replace && value.replace(
        UNSAFE_CHARS_PATTERN,
        function (unsafeChar) { return UNICODE_CHARS[unsafeChar]; }
      ) === value ? value : target[property];
    }
    else if (target.type ===  'group' && property === 'sortBy') {
      const allowed = [
        'position',
        'reverse-position',
        'alphabetically',
        'reverse-alphabetically'
      ];
      cleanValue = allowed.indexOf(value) !== -1 ? value : target[property];
    }
    else if (target.type ===  'group' && property === 'expanded') {
      cleanValue = Boolean(value) === value ? value : target[property];
    }
    else if (property === 'icon') {
      const allowed = [
        'octicon-',
        'devicon-'
      ];
      cleanValue = allowed.map(
        (val) => value && value.startsWith(val) ? value : undefined
      ).filter(
        (val) => val !== undefined
      );

      cleanValue = cleanValue.length === 1 ? cleanValue[0] : target[property];
    }
    else if (property === 'color') {
      const regEx = new RegExp('^#(?:[0-9a-f]{3}){1,2}$', 'i');
      cleanValue = regEx.exec(value) !== null ? value : target[property];
    }
    else if (target.type ===  'project' && property === 'devMode') {
      cleanValue = Boolean(value) === value ? value : target[property];
    }
    target[property] = cleanValue;
    return true;
  }
};

module.exports = {
  createGroup: function _createGroup () {
    let group = Object.assign(groupModel);
    let model = Object.assign({}, group, groupMethods);
    model.uuid = 'pv_' + Math.ceil(Date.now() * Math.random());
    Object.preventExtensions();
    return new Proxy(model, handler);
  },
  createProject: function _createproject () {
    let project = Object.assign(projectModel);
    project.paths = []
    let model = Object.assign({}, project, projectMethods);
    model.uuid = 'pv_' + Math.ceil(Date.now() * Math.random());
    Object.preventExtensions();
    return new Proxy(model, handler);
  },
  createGroupSchema: function _createGroupSchema (
    {
      name = groupModel.name,
      sortBy = groupModel.sortBy,
      icon = groupModel.icon,
      color = groupModel.color,
      expanded = groupModel.expanded
    } = {}
  ) {
    return { name, sortBy, icon, color, expanded };
  },
  createProjectSchema: function _createProjectSchema (
    {
      name = projectModel.name,
      icon = projectModel.icon,
      color = projectModel.color,
      devMode = projectModel.devMode,
      paths = []
    } = {}
  ) {
    return { name, icon, color, devMode, paths };
  }
};
