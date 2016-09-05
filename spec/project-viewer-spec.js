'use strict';

const _utils = require('../src/utils');
const _api = require('../src/api');

describe ('project-viewer', function() {

  let workspaceElement;
  let projectViewer;
  let pack;
  // TODO: test with status-bar and/or tree-view active or not

  beforeEach (function () {
    workspaceElement = atom.views.getView(atom.workspace);

    atom.config.set('project-viewer.startupVisibility', true);

    expect(atom.packages.isPackageActive('tree-view')).toBe(false);
    expect(atom.packages.isPackageActive('status-bar')).toBe(false);
    expect(atom.packages.isPackageActive('project-viewer')).toBe(false);

    waitsForPromise (function () {
      return atom.packages.activatePackage('project-viewer')
        .then(function (_pack) {
          projectViewer = workspaceElement.querySelector('project-viewer2');
          pack = _pack;
        });
    });
  });

  describe ('activate', function () {

    it ('should append only one project-viewer', function () {
      expect(
        workspaceElement.querySelectorAll('project-viewer2').length
      ).toBe(1);

      atom.workspace.getActivePane().splitRight({copyActiveItem: true});

      expect(
        workspaceElement.querySelectorAll('project-viewer2').length
      ).toBe(1);
    })
  });

  describe ('deactivate', function () {
    it ('should remove project-viewer', function () {
      atom.packages.deactivatePackage('project-viewer');
      expect(workspaceElement.querySelector('project-viewer2')).toBeNull();
    })
  });

  describe ('when something', function () {
    beforeEach (function () {
      jasmine.attachToDOM(workspaceElement);
    });

    it ('stuff', function () {
      console.log(pack.loadTime, pack.activateTime);
      expect(pack.loadTime).toBeLessThan(5);
      expect(pack.activateTime).toBeLessThan(15);
    });
  });
});
