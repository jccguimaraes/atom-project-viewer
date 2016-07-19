'use strict';

const projectMapper = new WeakMap();

function createModel () {
  const project = Object.create(null, {
    projectId: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: 'pv_' + Date.now()
    },
    projectName: {
      configurable: false,
      enumerable: false,
      set: function (name) {
        let obj = projectMapper.get(this);
        if (!obj) {
          obj = {};
          projectMapper.set(this, obj);
        }
        if (Number(name) === name) {
          return;
        }
        obj.projectName = name;
      },
      get: function () {
        let obj = projectMapper.get(this);
        if (!obj) {
          return null;
        }
        return obj.projectName;
      }
    },
    projectIcon: {
      configurable: false,
      enumerable: false,
      set: function (icon) {
        let obj = projectMapper.get(this);
        if (!obj) {
          obj = {};
          projectMapper.set(this, obj);
        }
        if (Number(icon) === icon) {
          return;
        }
        obj.projectIcon = icon;
      },
      get: function () {
        let obj = projectMapper.get(this);
        if (!obj) {
          return null;
        }
        return obj.projectIcon;
      }
    },
    projectPaths: {
      configurable: false,
      enumerable: false,
      set: function (paths) {
        let obj = projectMapper.get(this);
        if (!obj) {
          obj = {};
          projectMapper.set(this, obj);
        }
        if (!paths) {
          return;
        }
        if (!obj.hasOwnProperty('projectPaths')) {
          obj.projectPaths = [];
        }
        if (Array.isArray(paths)) {
          paths.forEach(
            (path) => this.projectPaths = path
          );
          return;
        }
        if (typeof paths !== 'string') {
          return;
        }
        // this regex is not well formed yet
        let regex = /(^\/(?:[a-zA-z0-9-_.]*\/?)*)|(^\w:\\\\(?:[a-zA-z0-9-_.]*\\?)*)/;
        if (paths.match(regex) === null) {
          return;
        }
        if (obj.projectPaths.indexOf(paths) === -1) {
          console.debug(paths);
          obj.projectPaths.push(paths);
        }
      },
      get: function () {
        let obj = projectMapper.get(this);
        if (!obj) {
          return null;
        }
        return obj.projectPaths;
      }
    }
  });
  return project;
}

const viewMethods = {
  createdCallback: function createdCallback () {
    let listItem = document.createElement('span');
    listItem.classList.add('list-item');
    this.appendChild(listItem);
    console.debug(this);
  }
};

function createView (model) {
  const tagExtends = 'li';
  const tagIs = 'project-viewer-project';
  let viewConstructor;
  let view;

  try {
    viewConstructor = document.registerElement(
      tagIs,
      {
        prototype: viewMethods,
        extends: tagExtends
      }
    );
    Object.setPrototypeOf(viewMethods, HTMLElement.prototype);
    view = new viewConstructor();
  } catch (e) {
    view =  document.createElement(tagIs, tagExtends);
  }
  projectMapper.set(view, model);
  return view;
}

/**
* Project.
* @module project-viewer/project
*/

module.exports = {
  /** Create a project model */
  createModel,

  /** Create a project view given a project model */
  createView,
};
