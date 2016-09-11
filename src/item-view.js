'use strict';

const _caches = require('./caches');
const _constructor = require('./constructor');

const viewMethods = {
  initialize: function _initialize () {
    const model = _caches.get(this);

    if (!model) {
      return;
    }

    this.classList.add('list-item');
    this.setAttribute('data-project-viewer-uuid', model.uuid);
  },
  render: function _render () {
    const model = _caches.get(this);

    if (!model) {
      return;
    }

    let spanNode = this.querySelector('span');
    let contentNode = this;

    if (model.icon && !spanNode) {
      contentNode.textContent = '';
      spanNode = document.createElement('span');
      contentNode.appendChild(spanNode);
    }

    if (model.icon) {
      contentNode = spanNode;
      if (model.icon.startsWith('octicon-')) {
        contentNode.classList.add('octicon', model.icon);
      }
      else {
        contentNode.classList.add('icon', model.icon);
      }
    }
    else if (spanNode) {
      contentNode.removeChild(spanNode);
    }

    if (model.name) {
      contentNode.textContent = model.name;
    }

    contentNode.addEventListener(
      'click',
      () => {
        atom.open(
          {
            pathsToOpen: model.paths,
            newWindow: false,
            devMode: false,
            safeMode: false
          }
        );
      },
      false
    );
  },
  sorting: function _sorting () {
    const model = _caches.get(this);

    if (!model) {
      return;
    }
    return model.name;
  }
};

const createView = function _createView (model) {
  let options = {
    tagExtends: 'li',
    tagIs: 'project-viewer-list-item'
  };
  return _constructor.createView(options, viewMethods, model);
};

module.exports = {
  createView: createView
};
