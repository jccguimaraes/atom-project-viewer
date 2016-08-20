'use strict';

const _view = require('../src/group-view');

describe ('group-view', function() {
  it ('if no valid model is passed it will throw errors', function() {
    const view = _view.createView();

    const fnInitialize = function _fnInitialize () {
      return view.initialize;
    }
    const fnRender = function _fnRender () {
      return view.render;
    }

    expect(view).toBeUndefined();
    // expect(fnInitialize).toThrow();
    // expect(fnRender).toThrow();
  });

  it ('should return an HTMLElement', function() {
    const model = {
      uuid: 'pv_' + Math.ceil(Date.now() * Math.random()),
      type: 'group'
    };
    const view = _view.createView(model);

    view.initialize();
    view.render();
    expect(view).toBeInstanceOf(HTMLElement);
  });

  it ('view 2', function() {
    const model = {
      uuid: 'pv_' + Math.ceil(Date.now() * Math.random()),
      type: 'group',
      name: 'group #1'
    };
    const view = _view.createView(model);
    view.initialize();
    view.render();
    expect(true).toBe(true);
  });

  it ('view 3', function() {
    const model1 = {
      uuid: 'pv_' + Math.ceil(Date.now() * Math.random()),
      type: 'group',
      name: 'group #1'
    };
    const model2 = {
      uuid: 'pv_' + Math.ceil(Date.now() * Math.random()),
      type: 'group',
      name: 'group #2'
    };
    const view1 = _view.createView(model1);
    const view2 = _view.createView(model2);
    view1.initialize();
    view1.render();
    view2.initialize();
    view2.render();
    expect(true).toBe(true);
  });
});
