'use strict';

const domBuilder = require('../src/dom-builder');
const map = require('./../src/map');

describe ('dom-builder', function () {

  it ('should not build an element', function () {
    let view = domBuilder.createView(
      'pv-dummy'
    );
    expect(view).toBeUndefined();
  });

  it ('should build an element', function () {
    let view = domBuilder.createView(
      {
        tagIs: 'pv-dummy'
      }
    );
    expect(view).not.toBeUndefined();
    expect(view instanceof HTMLElement).toBe(true);
    expect(view.nodeName).toBe('PV-DUMMY');
  });

  it ('should build an element with custom methods', function () {
    let methods = {
      doStuff: function () { return 'stuff'; }
    };
    let view = domBuilder.createView(
      {
        tagIs: 'pv-dummy-2'
      },
      methods
    );
    expect(view.doStuff()).toBe('stuff');
  });

  it ('should build an element that extends DIV tag', function () {
    let view = domBuilder.createView(
      {
        tagIs: 'pv-dummy-4',
        tagExtends: 'div'
      }
    );
    expect(view.nodeName).toBe('DIV');
  });

  it ('should build an element with an associated model', function () {
    let model = {
      doStuff: function () { return 'stuff'; }
    };
    let view = domBuilder.createView(
      {
        tagIs: 'pv-dummy-3'
      },
      undefined,
      model
    );
    let sameModel = map.get(view);
    expect(sameModel).toBe(model);
  });
});
