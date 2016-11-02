'use strict';

const cleanConfig = require('../src/_common').cleanConfig;
const getModel = require('../src/_common').getModel;
const model = require('../src/_model');
const view = require('../src/_item-view');

describe ('common', function () {

  it ('should clean a config entry not defined', function () {
    atom.config.set('project-viewer.dummy-config', 'dummy-config');
    expect(atom.config.get('project-viewer.dummy-config')).toBe('dummy-config');
    cleanConfig();
    expect(atom.config.get('project-viewer.dummy-config')).toBeUndefined();
  });

  it ('should not get any model if not a valid vew', function () {
    const itemView = document.createElement('div');
    expect(getModel(itemView)).toBeUndefined();
  });

  it ('should get the model associated with a valid view', function () {
    const itemModel = model.createProject();
    const itemView = view.createView(itemModel);
    expect(getModel(itemView)).toBe(itemModel);
  });
});
