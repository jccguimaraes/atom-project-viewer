'use strict';

xdescribe ('project-viewer', function() {

  let workspaceElement;
  let projectViewer;
  // TODO: test with status-bar and/or tree-view active or not

  beforeEach (function () {
    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);
  });

  describe ('activate', function () {

    beforeEach (function () {
      waitsForPromise (function () {
        return atom.packages.activatePackage('project-viewer')
          .then(function () {
            projectViewer = workspaceElement.querySelector('project-viewer');
          });
      });
    });

    it ('should append only one project-viewer', function () {

      expect(
        workspaceElement.querySelectorAll('project-viewer').length
      ).toBe(1);

      atom.workspace.getActivePane().splitRight({copyActiveItem: true});

      expect(
        workspaceElement.querySelectorAll('project-viewer').length
      ).toBe(1);
    })
  });

  describe ('deactivate', function () {

    beforeEach (function () {
      waitsForPromise (function () {
        return atom.packages.activatePackage('project-viewer')
          .then(function () {
            projectViewer = workspaceElement.querySelector('project-viewer');
          });
      });
    });

    it ('should remove project-viewer', function () {
      atom.packages.deactivatePackage('project-viewer');
      expect(workspaceElement.querySelector('project-viewer')).toBeNull();
    })
  });

  describe ('project-viwer:toggle is triggered', function () {

    it ('should be visible', function () {
      waitsFor (function () {
        return atom.packages.activatePackage('project-viewer');
      });

      runs(function () {
        projectViewer = workspaceElement.querySelector('project-viewer');
        const parent = projectViewer.parentNode;
        expect(parent).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'project-viewer:toggle');
        expect(parent).not.toBeVisible();
      });
    });

    it ('should not be visible', function () {

      waitsFor (function () {
        atom.config.set('project-viewer.visibilityActive', false);
        return atom.packages.activatePackage('project-viewer');
      });

      runs(function () {
        projectViewer = workspaceElement.querySelector('project-viewer');
        const parent = projectViewer.parentNode;
        expect(parent).not.toBeVisible();
        atom.commands.dispatch(workspaceElement, 'project-viewer:toggle');
        expect(parent).toBeVisible();
      });
    });
  });

  xdescribe ('project-viwer:editor is triggered', function () {});

  xdescribe ('project-viwer:autohide is triggered', function () {});

  xdescribe ('config changes', function () {

    describe ('changing visibilityOption');

    describe ('changing visibilityActive');

    describe ('changing panelPosition');

    describe ('changing autoHide');
  });
});
