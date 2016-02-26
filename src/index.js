'use strict';

const CompositeDisposable = require('atom').CompositeDisposable,
    Path = require('path'),
    Main = require('./main'),
    StatusBar = require('./status-bar'),
    ProjectsPool = require('./projects-pool');

/**
* A Class that represents the Project Viewer
*/
class ProjectViewer {
    /**
    * This required method is called when your package is activated.
    * It is passed the state data from the last time the window was
    * serialized if your module implements the serialize() method.
    * Use this to do initialization work when your package is
    * started (like setting up DOM elements or binding events).
    * @param {string} state - a serialized data
    */
    static activate (/*state*/) {

        this.disposables = new CompositeDisposable();
        this.disposables.add(
            atom.commands.add('atom-workspace', {
                'project-viewer2:toggleDisplay': this.togglePanel.bind(this),
                'project-viewer2:editFile': this.editFile.bind(this),
                'project-viewer2:toggleFocus': this.toggleFocus.bind(this)
            }));

        this.panel = atom.workspace.addRightPanel({
            item: atom.views.getView(new Main()),
            visible: atom.config.get('project-viewer2.startupVisibility')
        });

        ProjectsPool.onDidChangeSelectedProject((project) => {
            this.statusBarTile.getItem().updateContent(project.name);
        });

        atom.config.onDidChange('project-viewer2.statusBarVisibility', (status) => {
            let statusBarView;

            if (!this.statusBarTile) {
                return;
            }

            statusBarView = this.statusBarTile.getItem();

            if (status.newValue) {
                statusBarView.show();
            } else {
                statusBarView.hide();
            }
        });
    }

    static togglePanel () {
        this.panel.visible ? this.panel.hide() : this.panel.show();
    }

    static editFile () {
        let path = Path.join(atom.styles.configDirPath, 'project-viewer2.json');
        atom.workspace.open(path);
    }

    static toggleFocus () {
        this.panel.getItem().toggleFocus();
    }

    static projectViewerOn () {}

    static projectViewerEmit () {}

    /**
    * This optional method is called when the window is shutting down,
    * allowing you to return JSON to represent the state of your component.
    * When the window is later restored, the data you returned is passed to
    * your module’s activate method so you can restore your view to
    * where the user left off.
    */
    static serialize () {}

    /**
    * This optional method is called when the window is shutting down.
    * If your package is watching any files or holding external resources
    * in any other way, release them here. If you’re just subscribing to
    * things on window, you don’t need to worry because that’s
    * getting torn down anyway.
    */
    static deactivate () {
        this.disposables.dispose();
        this.panel.destroy();

        if (this.statusBarTile) {
            this.statusBarTile.destroy();
            this.statusBarTile = null;
        }
    }

    static consumeStatusBar (statusBar) {
        this.statusBarTile = statusBar.addRightTile({
            item: new StatusBar(),
            priority: 0
        });
        if (atom.config.get('project-viewer2.statusBarVisibility')) {
            this.statusBarTile.getItem().show();
        }
    }

    static get config () {
        return {
            startupVisibility: {
                description: 'Define if you want **project-viewer** to be visible on startup.',
                type: 'boolean',
                default: false,
                order: 0
            },
            statusBarVisibility: {
                description: 'Define if you want **project-viewer** to show active *group* and *project*.',
                type: 'boolean',
                default: false,
                order: 1
            },
            autohide: {
                description: 'Hability to autohide project viewer',
                type: 'boolean',
                default: false,
                order: 2
            },
            keepProjectState: {
                description: 'Set to false will not keep track of each project\´s **tree-view** folder state',
                type: 'boolean',
                default: true,
                order: 3
            }
        };
    }
}

module.exports = ProjectViewer;
