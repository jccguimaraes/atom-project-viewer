const SelectListView = require('atom-space-pen-views').SelectListView,
    $$ = require('atom-space-pen-views').$$;

const _utilities = require('./utilities');
const gateway = require('./gateway');

class PVSelectListView extends SelectListView {

    constructor () {
        super();

        atom.commands.add(
            'atom-workspace',
            'project-viewer2:toggle-select-view',
            this.toggle.bind(this)
        );
        this.setLoading('loading projects');
    }

    viewForItem (item) {
        return $$(function() {
            return this.li({
                class: 'two-lines'
            }, () => {
                this.div({
                    class: 'status icon '.concat(item.projectIcon || item.groupIcon || item.clientIcon)
                });
                this.div({
                    class: 'primary-line no-icon'
                }, () => {
                    return this.text(item.projectName);
                });
                this.div({
                    class: 'primary-secondary no-icon'
                }, () => {
                    return this.text(
                        ''
                        .concat(item.clientName || '')
                        .concat(' / ')
                        .concat(item.groupName)
                    );
                });
                return this;
            });
        });
    }

    confirmed (item) {
        let serializationFile,
        serialization,
        project,
        currentProject;

        console.debug(item);

        // if (pv.selectedProject) {
        //     currentProject = pv.searchProject(
        //         pv.selectedProject.getProject()
        //     )[0];
        //
        //     serializationFile = atom.getStateKey(
        //         pv.selectedProject.getProject().paths
        //     );
        // }

        // if (serializationFile) {
        //     atom.storageFolder.store(
        //         serializationFile,
        //         {
        //             project: pv.projectSerialization(),
        //             workspace: pv.workspaceSerialization(),
        //             treeview: pv.treeViewSerialization()
        //         }
        //     );
        // }
        //
        // project = pv.searchProject(
        //     item.getProject()
        // )[0];
        //
        // if (!project) {
        //     this.cancel();
        // }
        //
        // pv.selectedProject = project;
        //
        // pv.selectedProject.openState();
        //
        // pv.storeDB();
        //
        this.cancel();
    }

    cancel () {
        this.hide();
    }

    selectPreviousItemView () {
        let view = this.getSelectedItemView().prev();
        if (!view.length) {
            view = this.list.find('li:last');
        }
        return this.selectItemView(view);
    }

    selectNextItemView () {
        let view = this.getSelectedItemView().next();
        if (!view.length) {
            view = this.list.find('li:first');
        }
        return this.selectItemView(view);
    }

    show () {
        this.storeFocusedElement();
        if (!this.panel) {
            this.panel = atom.workspace.addModalPanel({
                item: this
            });
        }
        this.setItems(gateway.project.fetchAllModels());
        this.panel.show();
        // this.scrollToItemView(this.list.find('li:first'));
        this.focusFilterEditor();
    }

    hide () {
        if (this.panel) {
            this.list.empty();
            this.panel.hide();
        }
    }

    toggle () {
        if (this.panel && this.panel.isVisible()) {
            this.hide();
        } else {
            this.show();
        }
    }
}

module.exports = PVSelectListView;
