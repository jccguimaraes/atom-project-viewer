'use strict';

const cleanConfig = require('../src/common').cleanConfig;
const getModel = require('../src/common').getModel;
const getView = require('../src/common').getView;
const sortList = require('../src/common').sortList;
const model = require('../src/model');
const view = require('../src/project-view');

describe ('common', function () {

  it ('should clean a config entry not defined', function () {
    atom.config.set('project-viewer.dummy-config', 'dummy-config');
    expect(atom.config.get('project-viewer.dummy-config')).toBe('dummy-config');
    cleanConfig();
    expect(atom.config.get('project-viewer.dummy-config')).toBeUndefined();
  });

  it ('should not get any view if not a valid view', function () {
    const itemView = document.createElement('div');
    expect(getView(itemView)).toBeNull();
  });

  it ('should get the view associated with a valid child view', function () {
    const itemModel = model.createProject();
    const itemView = view.createView(itemModel);
    itemView.initialize();
    itemView.render();
    const insideView = itemView.querySelector('span');
    expect(getView(insideView)).toBe(itemView);
  });

  it ('should get the view passed', function () {
    const itemModel = model.createProject();
    const itemView = view.createView(itemModel);
    itemView.initialize();
    itemView.render();
    expect(getView(itemView)).toBe(itemView);
  });

  it ('should not get any model if not a valid view', function () {
    const itemView = document.createElement('div');
    expect(getModel(itemView)).toBeUndefined();
  });

  it ('should get the model associated with a valid view', function () {
    const itemModel = model.createProject();
    const itemView = view.createView(itemModel);
    expect(getModel(itemView)).toBe(itemModel);
  });

  xdescribe ('#sortList', function () {
    const listPosition = [
      { name: 'bbbb'},
      { name: 'zzzz'},
      { name: 'aaaa'},
      { name: 'tttt'}
    ];
    const listReversePosition = [
      { name: 'tttt'},
      { name: 'aaaa'},
      { name: 'zzzz'},
      { name: 'bbbb'}
    ];
    const listAlphabetically = [
      { name: 'aaaa'},
      { name: 'bbbb'},
      { name: 'tttt'},
      { name: 'zzzz'}
    ];
    const listReverseAlphabetically = [
      { name: 'zzzz'},
      { name: 'tttt'},
      { name: 'bbbb'},
      { name: 'aaaa'}
    ];

    let list;

    beforeEach(function () {
      list = Array.from(listPosition);
    });

    it ('should keep the list\'s position as it is', function () {
      sortList(list, 'position');
      expect(list).toEqual(listPosition);
    });

    it ('should reverse the list\'s position', function () {
      sortList(list, 'reverse-position');
      expect(list).toEqual(listReversePosition);
    });

    it ('should sort the list in alphabetically order', function () {
      sortList(list, 'alphabetically');
      expect(list).toEqual(listAlphabetically);
    });

    it ('should sort the list in reverse alphabetically order', function () {
      sortList(list, 'reverse-alphabetically');
      expect(list).toEqual(listReverseAlphabetically);
    });
  });

});
