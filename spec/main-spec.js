'use strict';

xdescribe ('project-viewer', function () {

  let mainElement;

  beforeEach (function () {
    mainElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(mainElement);
  });

  describe ('activate', function () {

    it ('should append only one project-viewer', function () {
      waitsFor (function () {
        return atom.packages.activatePackage('project-viewer');
      });

      runs(function () {
        const projectViewer = mainElement.querySelectorAll('project-viewer');
        expect(projectViewer).toHaveLength(1);
        atom.workspace.getActivePane().splitRight({copyActiveItem: true});
        expect(projectViewer).toHaveLength(1);
      });
    });
  });

  describe ('deactivate', function () {

    it ('should remove project-viewer', function () {
      waitsFor (function () {
        return atom.packages.activatePackage('project-viewer');
      });

      runs(function () {
        atom.packages.deactivatePackage('project-viewer');
        const projectViewer = mainElement.querySelector('project-viewer');
        expect(projectViewer).toBeNull();
      });
    })
  });

  describe ('project-viewer:togglePanel', function () {

    it ('should be visible if visibilityActive is set', function () {
      waitsFor (function () {
        return atom.packages.activatePackage('project-viewer');
      });

      runs(function () {
        const projectViewer = mainElement.querySelector('project-viewer');
        const parentNode = projectViewer.parentNode;
        expect(parentNode).toBeVisible();
        atom.commands.dispatch(mainElement, 'project-viewer:togglePanel');
        expect(parentNode).toBeHidden();
      });
    });

    it ('should not be visible if visibilityActive is unset', function () {
      waitsFor (function () {
        atom.config.set('project-viewer.visibilityActive', false);
        return atom.packages.activatePackage('project-viewer');
      });

      runs(function () {
        const projectViewer = mainElement.querySelector('project-viewer');
        const parentNode = projectViewer.parentNode;
        expect(parentNode).toBeHidden();
        atom.commands.dispatch(mainElement, 'project-viewer:togglePanel');
        expect(parentNode).toBeVisible();
      });
    });
  });

  describe ('config changes', function () {

    xdescribe ('changing visibilityOption', function () {});

    describe ('changing visibilityActive', function () {

      it ('should be visible if visibilityActive is set', function () {

        waitsFor (function () {
          return atom.packages.activatePackage('project-viewer');
        });

        runs(function () {
          const projectViewer = mainElement.querySelector('project-viewer');
          const parent = projectViewer.parentNode;
          expect(parent).toBeVisible();
        });
      });

      it ('should not be visible if visibilityActive is unset', function () {

        waitsFor (function () {
          atom.config.set('project-viewer.visibilityActive', false);
          return atom.packages.activatePackage('project-viewer');
        });

        runs(function () {
          const projectViewer = mainElement.querySelector('project-viewer');
          const parent = projectViewer.parentNode;
          expect(parent).toBeHidden();
        });
      });
    });

    describe ('changing panelPosition', function () {

      it ('should start by default as a right panel', function () {

        waitsFor (function () {
          return atom.packages.activatePackage('project-viewer');
        });

        runs(function () {
          const projectViewer = mainElement.querySelector('project-viewer');
          let panels = [];
          atom.workspace.getRightPanels().forEach(function (panel) {
            if (panel.getItem() !== projectViewer) { return; }
            panels.push(panel.getItem());
          });
          expect(panels).toHaveLength(1);

          panels = [];
          atom.workspace.getLeftPanels().forEach(function (panel) {
            if (panel.getItem() !== projectViewer) { return; }
            panels.push(panel.getItem());
          });
          expect(panels).toHaveLength(0);
        });
      });

      it ('should start as a left panel if set to Left', function () {

        waitsFor (function () {
          atom.config.set('project-viewer.panelPosition', 'Left');
          return atom.packages.activatePackage('project-viewer');
        });

        runs(function () {
          const projectViewer = mainElement.querySelector('project-viewer');
          let panels = [];
          atom.workspace.getRightPanels().forEach(function (panel) {
            if (panel.getItem() !== projectViewer) { return; }
            panels.push(panel.getItem());
          });
          expect(panels).toHaveLength(0);

          panels = [];
          atom.workspace.getLeftPanels().forEach(function (panel) {
            if (panel.getItem() !== projectViewer) { return; }
            panels.push(panel.getItem());
          });
          expect(panels).toHaveLength(1);

          atom.config.set('project-viewer.panelPosition', 'Right');

          panels = [];
          atom.workspace.getRightPanels().forEach(function (panel) {
            if (panel.getItem() !== projectViewer) { return; }
            panels.push(panel.getItem());
          });
          expect(panels).toHaveLength(1);

          panels = [];
          atom.workspace.getLeftPanels().forEach(function (panel) {
            if (panel.getItem() !== projectViewer) { return; }
            panels.push(panel.getItem());
          });
          expect(panels).toHaveLength(0);
        });
      });
    });

    describe ('changing autoHide', function () {

      it ('should not be partially hidden if autoHide is unset', function () {

        waitsFor (function () {
          return atom.packages.activatePackage('project-viewer');
        });

        runs(function () {
          const projectViewer = mainElement.querySelector('project-viewer');
          expect(projectViewer).not.toHaveClass('autohide');
          atom.config.set('project-viewer.autoHide', true);
          expect(projectViewer).toHaveClass('autohide');
        });
      });

      it ('should be partially hidden if autoHide is set', function () {

        waitsFor (function () {
          atom.config.set('project-viewer.autoHide', true);
          return atom.packages.activatePackage('project-viewer');
        });

        runs(function () {
          const projectViewer = mainElement.querySelector('project-viewer');
          expect(projectViewer).toHaveClass('autohide');
          atom.config.set('project-viewer.autoHide', false);
          expect(projectViewer).not.toHaveClass('autohide');
        });
      });
    });

    describe ('changing hideHeader', function () {

      it ('should show the title by default', function () {

        waitsFor (function () {
          return atom.packages.activatePackage('project-viewer');
        });

        runs(function () {
          const projectViewer = mainElement.querySelector('project-viewer');
          const title = projectViewer.querySelector('.heading');
          expect(title).not.toHaveClass('hidden');
          atom.config.set('project-viewer.hideHeader', true);
          expect(title).toHaveClass('hidden');
        });
      });

      it ('should not show the title if set to false', function () {

        waitsFor (function () {
          atom.config.set('project-viewer.hideHeader', true);
          return atom.packages.activatePackage('project-viewer');
        });

        runs(function () {
          const projectViewer = mainElement.querySelector('project-viewer');
          const title = projectViewer.querySelector('.heading');
          expect(title).toHaveClass('hidden');
          atom.config.set('project-viewer.hideHeader', false);
          expect(title).not.toHaveClass('hidden');
        });
      });
    });

    xdescribe ('changing keepContext', function () {});

    xdescribe ('changing openNewWindow', function () {});

    xdescribe ('changing statusBar', function () {});
  });

  describe ('project-viewer:autohidePanel', function () {

    it ('should toggle partially hidden state', function () {

      waitsFor (function () {
        return atom.packages.activatePackage('project-viewer');
      });

      runs(function () {
        const projectViewer = mainElement.querySelector('project-viewer');
        const state = projectViewer.classList.contains('autohide');
        atom.commands.dispatch(mainElement, 'project-viewer:autohidePanel');
        expect(projectViewer.classList.contains('autohide')).not.toBe(state);
      });
    });
  });

  xdescribe ('project-viewer:openForm', function () {});

  describe ('project-viewer:focusPanel', function () {

    it ('should focus panel', function () {

      waitsFor (function () {
        return atom.packages.activatePackage('project-viewer');
      });

      runs(function () {
        const projectViewer = mainElement.querySelector('project-viewer');
        expect(projectViewer).not.toBe(document.activeElement);
        atom.commands.dispatch(mainElement, 'project-viewer:focusPanel');
        expect(projectViewer).toBe(document.activeElement);
        atom.commands.dispatch(mainElement, 'project-viewer:focusPanel');
        expect(projectViewer).not.toBe(document.activeElement);
      });
    });
  });

  xdescribe ('project-viewer:clearState', function () {});

  xdescribe ('project-viewer:clearStates', function () {});

});
