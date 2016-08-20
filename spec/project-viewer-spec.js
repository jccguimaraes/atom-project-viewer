'use strict';

const _utils = require('../src/utils');
const _api = require('../src/api');

describe ('project-viewer', function() {

  let workspaceElement;
  let activationPromise;

  // TODO: test with status-bar and/or tree-view active or not

  beforeEach (function () {
    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);

    expect(atom.packages.isPackageActive('tree-view')).toBe(false);
    expect(atom.packages.isPackageActive('status-bar')).toBe(false);
    expect(atom.packages.isPackageActive('project-viewer')).toBe(false);

    atom.config.set('project-viewer.startupVisibility', true);
    activationPromise = atom.packages.activatePackage('project-viewer');
    return activationPromise;
  });

  it ('should be active', function () {
    waitsForPromise (function () {
      return activationPromise;
    });

    runs (function () {
      expect(atom.packages.isPackageActive('tree-view')).toBe(false);
      expect(atom.packages.isPackageActive('status-bar')).toBe(false);
      expect(atom.packages.isPackageActive('project-viewer')).toBe(true);
    });
  });
});
