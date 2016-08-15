'use strict';

const mainMapper = new WeakMap();

const _helpers = require('./_helpers');

function createGroup () {
  const model = Object.create(null, {
    mainSort: {
      configurable: false,
      enumerable: false,
      set: function (sorting) {
        let obj = mainMapper.get(this);
        if (!obj) {
          obj = {};
          mainMapper.set(this, obj);
        }
        const allowedSorts = [
          'position',
          'reverse-position',
          'alphabetically',
          'reverse-alphabetically'
        ];
        if (allowedSorts.indexOf(sorting) === -1) {
          return;
        }
        obj.mainSort = sorting;
      },
      get: function () {
        let obj = mainMapper.get(this);
        if (obj && obj.hasOwnProperty('mainSort')) {
          return obj.mainSort;
        }
        return 'position';
      }
    }
  });
  return model;
}

const viewMethods = {
  createdCallback: function _createdCallback () {},
  attachedCallback: function _attachedCallback () {},
  detachedCallback: function _detachedCallback () {},
  initialize: function _initialize () {
    let h1 = document.createElement('h1');
    h1.textContent = 'Project Viewer';

    let mainTree = document.createElement('ul');
    mainTree.classList.add('list-tree', 'has-collapsable-children');

    this.appendChild(h1);
    this.appendChild(mainTree);

  },
  render: function _render () {
    const model = mainMapper.get(this);

    if (!model) {
      return;
    }

    let listTree = this.querySelector('.list-tree');

    if (listTree) {
      let nodes = _helpers.castToArray(listTree.childNodes);
      let sorted = nodes;
      if (model.mainSort === 'alphabetically') {
        sorted = _helpers.sortArray(nodes);
        console.debug(sorted);
      }
      sorted.forEach(
        (liView) => this.attachChild(liView)
      );
    }

    if (!listTree) {
      listTree = document.createElement('ul');
      listTree.classList.add('list-tree');
      this.appendChild(listTree);
    }
  },
  attachChild: function _attachChild (nodeOrModel) {
    let listTree = this.querySelector('.list-tree');
    if (!listTree) {
      this.render();
      listTree = this.querySelector('.list-tree');
    }
    let node = nodeOrModel;
    listTree.appendChild(node);
  },
  detachChild: function _detachChild (node) {
    let listTree = this.querySelector('.list-tree');
    if (!listTree) {
      return;
    }
    listTree.removeChild(node);
  }
};

function createView (model) {
  const tagIs = 'projector-viewer';
  let view;

  try {
    const viewConstructor = document.registerElement(
      tagIs,
      {
        prototype: viewMethods
      }
    );
    Object.setPrototypeOf(viewMethods, HTMLElement.prototype);
    view = new viewConstructor();
  } catch (e) {
    view =  document.createElement(tagIs);
  }

  if (model) {
    mainMapper.set(view, model);
  }

  return view;
}

/**
* Main.
* @module project-viewer/main
*/

module.exports = {
  /** Create a group model */
  createGroup,

  /** Create a group view given a group model */
  createView
};
