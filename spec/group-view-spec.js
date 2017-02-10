'use strict';

const groupView = require('../src/group-view');
const groupModel = require('../src/model');

xdescribe ('group-view', function () {

  it ('if no valid model is passed it will throw errors', function () {
    const view = groupView.createView();
    const fnInitialize = function _fnInitialize () {
      return view.initialize;
    }
    const fnRender = function _fnRender () {
      return view.render;
    }

    expect(view).toBeUndefined();
    expect(fnInitialize).toThrow();
    expect(fnRender).toThrow();
  });

  it ('should return an HTMLElement', function () {
    const model = {
      uuid: 'pv_' + Math.ceil(Date.now() * Math.random()),
      type: 'group'
    };
    const view = groupView.createView(model);

    expect(view).toBeInstanceOf(HTMLElement);
    expect(view.nodeName).toBe('LI');
    expect(view.getAttribute('is')).toBe('project-viewer-group');
  });

  it ('should initialize the view', function () {
    const model = {
      uuid: 'pv_' + Math.ceil(Date.now() * Math.random()),
      type: 'group'
    };
    const view = groupView.createView(model);
    const state = view.initialize();
    expect(state).toBe(true);
  });

  it ('should not render a span if model has no icon', function () {
    const model = groupModel.createGroup();
    const view = groupView.createView(model);
    view.initialize();
    view.render();
    const listItem = view.querySelector('.list-item');
    expect(listItem.childNodes).toHaveLength(1);
    expect(listItem.childNodes[0].nodeName).toBe('#text');
    expect(listItem.childNodes[0].classList).toBeUndefined();
    expect(listItem.childNodes[0].textContent).toBe(model.name);
  });

  it ('should render a span if model has icon', function () {
    const model = groupModel.createGroup({
      icon: 'devicon-atom'
    });
    const view = groupView.createView(model);
    view.initialize();
    view.render();
    const listItem = view.querySelector('.list-item');
    expect(listItem.childNodes).toHaveLength(1);
    expect(listItem.childNodes[0].nodeName).toBe('SPAN');
    expect(listItem.childNodes[0].classList.contains(model.icon)).toBe(true);
    expect(listItem.childNodes[0].textContent).toBe(model.name);
  });

  it ('should (un)render a span if icon is added or removed', function () {
    const icon = 'devicon-atom';
    const model = groupModel.createGroup({
      icon: icon
    });
    const view = groupView.createView(model);
    view.initialize();
    view.render();
    let listItem = view.querySelector('.list-item');
    expect(listItem.childNodes).toHaveLength(1);
    expect(listItem.childNodes[0].nodeName).toBe('SPAN');
    expect(listItem.childNodes[0].classList.contains(icon)).toBe(true);
    expect(listItem.childNodes[0].textContent).toBe(model.name);

    delete model.icon;
    view.render();

    expect(listItem.childNodes).toHaveLength(1);
    expect(listItem.childNodes[0].nodeName).toBe('#text');
    expect(listItem.childNodes[0].classList).toBeUndefined();
    expect(listItem.childNodes[0].textContent).toBe(model.name);
  });

  it ('should remove click event listener when detached', function () {
    const model = {
      uuid: 'pv_' + Math.ceil(Date.now() * Math.random()),
      type: 'group'
    };
    const father = document.createElement('div');
    const view = groupView.createView(model);
    view.initialize();
    view.render();
    father.appendChild(view);
    var evt = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    });
    expect(view).not.toHaveClass('collapsed');
    view.querySelector('.list-item').dispatchEvent(evt);
    expect(view).toHaveClass('collapsed');
    father.removeChild(view);
    view.querySelector('.list-item').dispatchEvent(evt);
    expect(view).toHaveClass('collapsed');
  });

  it ('should toggle collapsed', function () {
    const model = {
      uuid: 'pv_' + Math.ceil(Date.now() * Math.random()),
      type: 'group'
    };
    const view = groupView.createView(model);
    view.initialize();
    view.render();
    expect(view).not.toHaveClass('collapsed');
    view.toggle();
    expect(view).toHaveClass('collapsed');
    view.toggle();
    expect(view).not.toHaveClass('collapsed');
  });
});
