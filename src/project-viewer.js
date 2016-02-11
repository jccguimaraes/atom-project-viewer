'use strict';

const CompositeDisposable = require('atom').CompositeDisposable,
    Path = require('path'),
    Main = require('./main');

/**
 * A Class that represents the Project Viewer
 */
class ProjectViewer {

    constructor () {
        this.disposables = new CompositeDisposable();
    }

    /**
     * This required method is called when your package is activated.
     * It is passed the state data from the last time the window was
     * serialized if your module implements the serialize() method.
     * Use this to do initialization work when your package is
     * started (like setting up DOM elements or binding events).
     * @param {string} state - a serialized data
     */
    activate (/*state*/) {

        this.disposables.add(
            atom.commands.add('atom-workspace', {
                'project-viewer2:toggleDisplay': this.togglePanel.bind(this),
                'project-viewer2:editFile': this.editFile.bind(this),
                'project-viewer2:toggleFocus': this.toggleFocus.bind(this)
            }));

        this.panel = atom.workspace.addRightPanel({
            item: atom.views.getView(new Main()),
            visible: true
        });
    }

    togglePanel () {
        this.panel.visible ? this.panel.hide() : this.panel.show();
    }

    editFile () {
        let path = Path.join(atom.styles.configDirPath, 'project-viewer2.json');
        atom.workspace.open(path);
    }

    toggleFocus () {
        this.panel.getItem().toggleFocus();
    }
    
    /**
     * This optional method is called when the window is shutting down,
     * allowing you to return JSON to represent the state of your component.
     * When the window is later restored, the data you returned is passed to
     * your module’s activate method so you can restore your view to
     * where the user left off.
     */
    serialize () {}

    /**
     * This optional method is called when the window is shutting down.
     * If your package is watching any files or holding external resources
     * in any other way, release them here. If you’re just subscribing to
     * things on window, you don’t need to worry because that’s
     * getting torn down anyway.
     */
    deactivate () {
        this.disposables.dispose();
        this.panel.destroy();
    }

    consumeStatusBar (statusBar) {
        let a = document.createElement('div');
        a.classList.add('inline-block');
        a.textContent = 'FCN / project-viewer';
        this.statusBarTile = statusBar.addRightTile({
            item: a,
            priority: 0
        });
    }
}

module.exports = new ProjectViewer();
