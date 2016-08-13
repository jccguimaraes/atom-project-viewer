'use strict';

const _group = require('../src/__proxy');

describe ('group', function() {
  it ('should assign a name', function() {
    const obj = {
      model: _group.createModel(),
      prop: 'name',
      valOK: 'group #1'
    };

    obj.model[obj.prop] = obj.valOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);
  });

  it ('should keep the last name if setting an invalid', function() {
    const obj = {
      model: _group.createModel(),
      prop: 'name',
      valOK: 'group #1',
      valNOK: 1
    };

    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe('');

    obj.model[obj.prop] = obj.valOK;
    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);
  });

  it ('should assign a sortBy', function() {
    const obj = {
      model: _group.createModel(),
      prop: 'sortBy',
      valOK: 'alphabetically'
    };

    obj.model[obj.prop] = obj.valOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);
  });

  it ('should keep the last sort if setting an invalid', function() {
    const obj = {
      model: _group.createModel(),
      prop: 'sortBy',
      valOK: 'alphabetically',
      valNOK: 'dummy'
    };

    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe('position');

    obj.model[obj.prop] = obj.valOK;
    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);
  });

  it ('should assign an icon', function() {
    const obj = {
      model: _group.createModel(),
      prop: 'icon',
      valOK: 'icon-mark-github',
      valOK2: 'devicon-angular'
    };

    obj.model[obj.prop] = obj.valOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);

    obj.model[obj.prop] = obj.valOK2;
    expect(obj.model[obj.prop]).toBe(obj.valOK2);
  });

  it ('should keep the last icon if setting an invalid', function() {
    const obj = {
      model: _group.createModel(),
      prop: 'icon',
      valOK: 'icon-mark-github',
      valNOK: 'dummy'
    };

    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe('');

    obj.model[obj.prop] = obj.valOK;
    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);
  });

  it ('should assign a color', function() {
    const obj = {
      model: _group.createModel(),
      prop: 'color',
      valOK: '#fff000'
    };

    obj.model[obj.prop] = obj.valOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);

    obj.valOK = '#fff';
    obj.model[obj.prop] = obj.valOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);
  });

  it ('should keep the last color if setting an invalid', function() {
    const obj = {
      model: _group.createModel(),
      prop: 'color',
      valOK: '#fff000',
      valNOK: 'dummy'
    };

    obj.model[obj.prop] = obj.valOK;
    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);

    obj.valNOK = '#ffff';
    obj.model[obj.prop] = obj.valNOK;
    expect(obj.model[obj.prop]).toBe(obj.valOK);
  });

  it ('should set as prototype of another group model only', function() {
    const obj1 = _group.createModel();
    const obj2 = _group.createModel();
    obj1.name = 'group #1';
    obj2.name = 'group #2';

    Object.setPrototypeOf(obj1, obj2);
  });
});
