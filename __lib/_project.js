'use strict';

const projectMapper = new WeakMap();

function createGroup () {
  const model = Object.create(null, {
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
  return model;
}

const viewMethods = {
  createdCallback: function createdCallback () {},
  attachedCallback: function attachedCallback () {},
  detachedCallback: function detachedCallback () {},
  initialize: function initialize () {
    this.classList.add('list-item');
  },
  render: function render () {
    const model = projectMapper.get(this);

    if (!model) {
      return;
    }

    let spanNode = this.querySelector('span');
    let contentNode = this;

    if (model.projectIcon && !spanNode) {
      spanNode = document.createElement('span');
      contentNode.appendChild(spanNode);
    }

    if (model.projectIcon) {
      contentNode = spanNode;
      contentNode.classList.add('icon', model.projectIcon);
    }
    else if (spanNode) {
      contentNode.removeChild(spanNode);
    }

    if (model.projectName) {
      contentNode.textContent = model.projectName;
    }
  },
  sorting: function _sorting () {
    const model = projectMapper.get(this);

    if (!model) {
      return;
    }
    return model.projectName;
  }
};

function createView (model) {
  const tagExtends = 'li';
  const tagIs = 'project-viewer-project';
  let view;

  try {
    const viewConstructor = document.registerElement(
      tagIs,
      {
        prototype: viewMethods,
        extends: tagExtends
      }
    );
    Object.setPrototypeOf(viewMethods, HTMLElement.prototype);
    view = new viewConstructor();
  } catch (e) {
    view =  document.createElement(tagExtends, tagIs);
  }

  if (model) {
    projectMapper.set(view, model);
  }

  return view;
}

/**
* Project.
* @module project-viewer/project
*/

module.exports = {
  /** Create a project model */
  createGroup,

  /** Create a project view given a project model */
  createView
};
