'use strict';

const modelRef = require('../src/model');

xdescribe ('project-model', function () {
  it ('should have a type of project right?', function () {
    const model = modelRef.createProject();
    expect(model.type).toBe('project');
    model.type = 'not a project';
    expect(model.type).toBe('project');
  });

  it ('should not assign unknown properties', function () {
    const model = modelRef.createProject();
    expect(model.dummy).toBeNull();
    model.dummy = 'dummy value';
    expect(model.dummy).toBeNull();
  });

  it ('should assign a name', function () {
    const model = modelRef.createProject();
    expect(model.name).toBe('unnamed');
    model.name = 'project #1';
    expect(model.name).toBe('project #1');
  });

  it ('should keep the last name if setting an invalid', function () {
    const model = modelRef.createProject();
    model.name = 1;
    expect(model.name).toBe('unnamed');
    model.name = '🍺';
    expect(model.name).toBe('🍺');
    model.name = 'project #1';
    model.name = 1;
    expect(model.name).toBe('project #1');
    model.name = '<p>dummy</p>';
    expect(model.name).toBe('project #1');
  });

  it ('should not set the name in the prototype chain', function () {
    const model1 = modelRef.createProject();
    const model2 = modelRef.createProject();
    model2.name = 'project #2';
    expect(model1.name).toBe('unnamed');
  });

  it ('should assign a valid array of paths', function () {
    const model = modelRef.createProject();
    expect(model.paths).toEqual([]);
    // model.paths = ['path/to/somewhere'];
    // expect(model.paths).toEqual([]);
    // model.paths.push('path/to/somewhere');
    // expect(model.paths).toEqual([]);
    model.addPaths(1);
    model.addPaths({});
    expect(model.paths).toEqual([]);
    model.addPaths('path/to/somewhere');
    expect(model.paths).toEqual(['path/to/somewhere']);
    model.addPaths('another/path/to/somewhere');
    expect(model.paths).toEqual(
      ['path/to/somewhere', 'another/path/to/somewhere']
    );
    let removedPaths = model.clearPaths();
    expect(model.paths).toEqual([]);
    expect(removedPaths).toEqual(
      ['path/to/somewhere', 'another/path/to/somewhere']
    );
    model.addPaths(
      ['path/to/somewhere', 'another/path/to/somewhere']
    );
    expect(model.paths).toEqual(
      ['path/to/somewhere', 'another/path/to/somewhere']
    );
    model.addPaths(
      [1, {}]
    );
    expect(model.paths).toEqual(
      ['path/to/somewhere', 'another/path/to/somewhere']
    );
    model.removePaths(
      ['path/to/somewhere', 'another/path/to/somewhere']
    );
    expect(model.paths).toEqual([]);
  });

  it ('should assign a valid array of paths to each item', function () {
    const model1 = modelRef.createProject();
    const model2 = modelRef.createProject();
    model1.addPaths('path/to/somewhere');
    expect(model1.paths).toEqual(['path/to/somewhere']);
    expect(model2.paths).toEqual([]);
    model2.addPaths('another/path/to/somewhere');
    expect(model1.paths).toEqual(['path/to/somewhere']);
    expect(model2.paths).toEqual(['another/path/to/somewhere']);
    model1.clearPaths();
    expect(model1.paths).toEqual([]);
    model1.addPaths(['path/to/somewhere', 'another/path/to/somewhere']);
    model1.removePath('path/to/somewhere');
    expect(model1.paths).toEqual(['another/path/to/somewhere']);
    model1.addPaths(['path/to/somewhere', 'another/path/to/somewhere']);
    model1.removePaths(['path/to/somewhere', 'another/path/to/somewhere']);
    expect(model1.paths).toEqual([]);
  });

  it ('should assign an icon', function () {
    const model = modelRef.createProject();
    expect(model.icon).toBe('');
    model.icon = 'octicon-mark-github';
    expect(model.icon).toBe('octicon-mark-github');
    model.icon = 'devicon-angular';
    expect(model.icon).toBe('devicon-angular');
  });

  it ('should keep the last icon if setting an invalid', function () {
    const model = modelRef.createProject();
    model.icon = 'dummy';
    expect(model.icon).toBe('');
    model.icon = 'octicon-mark-github';
    model.icon = 'dummy';
    expect(model.icon).toBe('octicon-mark-github');
  });

  it ('should assign a color', function () {
    const model = modelRef.createProject();
    expect(model.color).toBe('');
    model.color = '#fff000';
    expect(model.color).toBe('#fff000');
    model.color = '#fff';
    expect(model.color).toBe('#fff');
  });

  it ('should keep the last color if setting an invalid', function () {
    const model = modelRef.createProject();
    model.color = '#fff000';
    model.color = 'dummy';
    expect(model.color).toBe('#fff000');
    model.color = '#ffff';
    expect(model.color).toBe('#fff000');
  });

  it ('should have false as the default devMode state', function () {
    const model = modelRef.createProject();
    expect(model.devMode).toBe(false);
  });

  it ('should set devMode state as true or false', function () {
    const model = modelRef.createProject();
    model.devMode = true;
    expect(model.devMode).toBe(true);
    model.devMode = 'dummy';
    expect(model.devMode).toBe(true);
    model.devMode = false;
    expect(model.devMode).toBe(false);
  });

  it ('should set as prototype of another project model only', function () {
    const model1 = modelRef.createProject();
    const model2 = modelRef.createProject();
    model2.name = 'project #2';
    const setPrototype = function (target, proto) {
      return Object.setPrototypeOf(target, proto);
    };
    expect(setPrototype.bind(null, model1, model2)).toThrow();
    expect(Object.getPrototypeOf(model1)).toEqual(Object.prototype);
    expect(setPrototype.bind(null, model1, {})).toThrow();
    expect(Object.getPrototypeOf(model1)).toEqual(Object.prototype);
  });

  it ('should get the project\'s breadcrumb', function () {
    const model1 = modelRef.createProject();
    const model2 = modelRef.createGroup();
    expect(model1.breadcrumb()).toEqual('unnamed');
    model1.name = 'project #1';
    expect(model1.breadcrumb()).toEqual('project #1');
    Object.setPrototypeOf(model1, model2);
    expect(model1.breadcrumb()).toEqual('unnamed / project #1');
    model2.name = 'group #1';
    expect(model1.breadcrumb()).toEqual('group #1 / project #1');
  });

  it ('should create a model if a candidate is not valid', function () {
    const candidate = {
      asdasd: 'project candidate #1'
    };
    const model = modelRef.createProject(candidate);
    expect(model.name).toBe('unnamed');
  });

  it ('should create a model if a candidate is valid', function () {
    const candidate = {
      name: 'project candidate #1'
    };
    const model = modelRef.createProject(candidate);
    expect(model.name).toBe(candidate.name);
  });
});
