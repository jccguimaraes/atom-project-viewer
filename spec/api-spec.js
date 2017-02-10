'use strict';

const api = require('./../src/api');

xdescribe ('api', function () {

  it ('should create a group model', function () {
    const candidate = {name: 'group #1'};
    const groupModel = api.group.createModel(candidate);
    expect(groupModel.name).toBe('group #1');
  });

  it ('should create a project model', function () {
    const candidate = {name: 'project #1'};
    const groupModel = api.project.createModel(candidate);
    expect(groupModel.name).toBe('project #1');
  });
});
