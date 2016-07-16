'use strict';

const projectMapper = new WeakMap();

function createModel () {
  const project = Object.create(null, {
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
    }
  });
  return Object.freeze(project);
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
