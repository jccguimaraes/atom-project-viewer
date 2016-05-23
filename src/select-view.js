const SelectListView = require('atom-space-pen-views').SelectListView,
    $$ = require('atom-space-pen-views').$$;

const _utilities = require('./utilities');
const gateway = require('./gateway');

class PVSelectListView extends SelectListView {

    constructor () {
        super();

        atom.commands.add(
            'atom-workspace',
            'project-viewer:toggle-select-view',
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
                    return this.strong({}, () => {
                        return this.text(item.projectName);
                    });
                });
                this.div({
                    class: 'primary-secondary no-icon'
                }, () => {
                    let projectLine = '';
                    if (item.clientName) {
                        projectLine += item.clientName;
                    }
                    if (item.groupName) {
                        projectLine += (projectLine.length ? ' / ': '') + item.groupName;
                    }
                    return this.text(projectLine);
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

        gateway.project.openOnTreeView(item);

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
        const projectViewer = document.querySelector('project-viewer');
        this.setItems(gateway.project.fetchAllModels(projectViewer));
        this.panel.show();
        this.scrollToItemView(this.list.find('li:first'));
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
