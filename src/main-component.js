'use strict';

const _utils = require('./utils');

const definition = {
    custom: 'project-viewer'
};

let startX;
let startWidth;
let dragListener;
let stopListener;

const resizerResetDrag = function _resizerResetDrag () {
  this.removeAttribute('style');
  atom.config.set('project-viewer.customWidth', undefined);
};

const resizerInitializeDrag = function _resizerInitializeDrag (event) {
  this.classList.add('resizing');
  startX = event.clientX;
  startWidth = parseInt(window.getComputedStyle(this).width, 10);
  document.addEventListener('mousemove', dragListener, false);
  document.addEventListener('mouseup', stopListener, false);
};

const resizerDoDrag = function _resizerDoDrag (event) {
  let variation;
  if (atom.config.get('project-viewer.panelPosition') === 'Right') {
    variation = startX - event.clientX;
  }
  else {
    variation = event.clientX - startX;
  }
  this.setAttribute('style',`width:${startWidth + variation}px;`);
};

const resizerStopDrag = function _resizerStopDrag () {
  this.classList.remove('resizing');
  document.removeEventListener('mousemove', dragListener, false);
  document.removeEventListener('mouseup', stopListener, false);
  let value = parseInt(window.getComputedStyle(this).width, 10);

  if (value === 180) {
    value = undefined;
  }
  atom.config.set('project-viewer.customWidth', value);
};

const htmlMethods = {
    createdCallback: function createdCallback() {
        this.setAttribute('tabindex', -1);

        var pvResizer = document.createElement('div');
        pvResizer.classList.add('pv-resizer');
        this.appendChild(pvResizer);
        dragListener = resizerDoDrag.bind(this);
        stopListener = resizerStopDrag.bind(this);
        pvResizer.addEventListener('mousedown', resizerInitializeDrag.bind(this), false);
        pvResizer.addEventListener("dblclick", resizerResetDrag.bind(this), false);

        atom.config.observe('project-viewer.panelPosition', function (value) {
          if (value === 'Left') {
            pvResizer.classList.add('invert');
          }
          else {
            pvResizer.classList.remove('invert');
          }
        });
        if (atom.config.get('project-viewer.customWidth') !== 180) {
          this.setAttribute('style',`width:${atom.config.get('project-viewer.customWidth')}px;`);
        }
    },
    addNode: function addNode(node, force) {
        if (!node) {
            _utils.notification('error', 'nothing to add', {
                icon: 'code'
            });
            return;
        }
        if (!force && this.hasNode(node)) {
            _utils.notification('info', 'it\'s already here!', {
                icon: 'code'
            });
            return;
        }
        this.appendChild(node);
    },
    hasNode: function hasNode(node) {
        let has = false;
        for (let idx = 0; idx < this.childNodes.length; idx++) {
            if (this.childNodes[idx] === node) {
                has = true;
                break;
            }
        }
        return has;
    }
};

Object.setPrototypeOf(htmlMethods, HTMLElement);

module.exports = {
    definition: definition,
    methods: htmlMethods
};
