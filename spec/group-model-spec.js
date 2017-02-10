'use strict';

const modelRef = require('../src/model');

xdescribe ('group-model', function () {
  it ('should have a type of group right?', function () {
    const model = modelRef.createGroup();
    expect(model.type).toBe('group');
    model.type = 'not a group';
    expect(model.type).toBe('group');
  });

  it ('should not assign unknown properties', function () {
    const model = modelRef.createGroup();
    expect(model.dummy).toBeNull();
    model.dummy = 'dummy value';
    expect(model.dummy).toBeNull();
  });

  it ('should assign a name', function () {
    const model = modelRef.createGroup();
    expect(model.name).toBe('unnamed');
    model.name = 'group #1';
    expect(model.name).toBe('group #1');
  });

  it ('should not assign a name if empty string', function () {
    const model = modelRef.createGroup({
        name: ''
    });
    expect(model.name).toBe('unnamed');
  });

  it ('should keep the last name if setting an invalid', function () {
    const model = modelRef.createGroup();
    model.name = 1;
    expect(model.name).toBe('unnamed');
    model.name = '';
    expect(model.name).toBe('unnamed');
    model.name = '🍺';
    expect(model.name).toBe('🍺');
    model.name = 'group #1';
    model.name = 1;
    expect(model.name).toBe('group #1');
    model.name = '<p>dummy</p>';
    expect(model.name).toBe('group #1');
  });

  it ('should not set the name in the prototype chain', function () {
    const model1 = modelRef.createGroup();
    const model2 = modelRef.createGroup();
    model2.name = 'group #2';
    expect(model1.name).toBe('unnamed');
  });

  it ('should assign a sortBy', function () {
    const model = modelRef.createGroup();
    expect(model.sortBy).toBe('position');
    model.sortBy = 'alphabetically';
    expect(model.sortBy).toBe('alphabetically');
  });

  it ('should keep the last sort if setting an invalid', function () {
    const model = modelRef.createGroup();
    model.sortBy = 'dummy';
    expect(model.sortBy).toBe('position');
    model.sortBy = 'alphabetically';
    model.sortBy = 'dummy';
    expect(model.sortBy).toBe('alphabetically');
  });

  it ('should assign an icon', function () {
    const model = modelRef.createGroup();
    expect(model.icon).toBe('');
    model.icon = 'octicon-mark-github';
    expect(model.icon).toBe('octicon-mark-github');
    model.icon = 'devicon-angular';
    expect(model.icon).toBe('devicon-angular');
  });

  it ('should keep the last icon if setting an invalid', function () {
    const model = modelRef.createGroup();
    model.icon = 'dummy';
    expect(model.icon).toBe('');
    model.icon = 'octicon-mark-github';
    model.icon = 'dummy';
    expect(model.icon).toBe('octicon-mark-github');
  });

  it ('should assign a color', function () {
    const model = modelRef.createGroup();
    expect(model.color).toBe('');
    model.color = '#fff000';
    expect(model.color).toBe('#fff000');
    model.color = '#fff';
    expect(model.color).toBe('#fff');
  });

  it ('should keep the last color if setting an invalid', function () {
    const model = modelRef.createGroup();
    model.color = '#fff000';
    model.color = 'dummy';
    expect(model.color).toBe('#fff000');
    model.color = '#ffff';
    expect(model.color).toBe('#fff000');
  });

  it ('should have false as the default expanded state', function () {
    const model = modelRef.createGroup();
    expect(model.expanded).toBe(false);
  });

  it ('should set expanded state as true or false', function () {
    const model = modelRef.createGroup();
    model.expanded = true;
    expect(model.expanded).toBe(true);
    model.expanded = 'dummy';
    expect(model.expanded).toBe(true);
    model.expanded = false;
    expect(model.expanded).toBe(false);
  });

  it ('should get the group\'s breadcrumb', function () {
    const model1 = modelRef.createGroup();
    const model2 = modelRef.createGroup();
    expect(model1.breadcrumb()).toEqual('unnamed');
    Object.setPrototypeOf(model1, model2);
    expect(model1.breadcrumb()).toEqual('unnamed / unnamed');
    model1.name = 'group #1';
    model2.name = 'group #2';
    expect(model1.breadcrumb()).toEqual('group #2 / group #1');
  });

  it ('should set as prototype of another group model only', function () {
    const model1 = modelRef.createGroup();
    const model2 = modelRef.createGroup();
    model2.name = 'group #2';
    const setPrototype = function (target, proto) {
      return Object.setPrototypeOf(target, proto);
    };
    expect(setPrototype.bind(null, model1, model2)).not.toThrow();
    expect(Object.getPrototypeOf(model1)).toEqual(model2);
    expect(setPrototype.bind(null, model1, {})).toThrow();
    expect(Object.getPrototypeOf(model1)).toEqual(model2);
  });

  it ('should create a model if a candidate is not valid', function () {
    const candidate = {
      asdasd: 'group candidate #1'
    };
    const model = modelRef.createGroup(candidate);
    expect(model.name).toBe('unnamed');
  });

  it ('should create a model if a candidate is valid', function () {
    const candidate = {
      name: 'group candidate #1'
    };
    const model = modelRef.createGroup(candidate);
    expect(model.name).toBe(candidate.name);
  });
});
