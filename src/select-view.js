'use strict';

const CompositeDisposable = require('atom').CompositeDisposable;

const SelectListView = require('atom-space-pen-views').SelectListView,
    $$ = require('atom-space-pen-views').$$;

const _utilities = require('./utilities');

class PVSelectListView extends SelectListView {

    constructor () {
        super();
    }

    initialize () {

        this.disposables = new CompositeDisposable();

        this.setLoading('loading projects...');
        this.getEmptyMessage('couldn\'t find any projects');

        this.disposables.add(
            atom.commands.add(
                'atom-workspace', {
                    'project-viewer:toggle-select-view': this.toggle.bind(this),
                    'core:move-up': this.selectPreviousItemView.bind(this),
                    'core:move-down': this.selectNextItemView.bind(this),
                    'core:confirm': this.confirmSelection.bind(this),
                    'core:cancel': this.cancelSelection.bind(this)
                }
            )
        );
    }

    destroy () {
        this.cancel();

        this.disposables.dispose();
        this.disposables = null;

        if (this.panel) {
            this.panel.destroy();
        }
    }

    cancelSelection () {
        if (this.panel && this.panel.isVisible()) {
            this.cancel();
        }
    }

    confirmSelection () {
        const item = this.getSelectedItem();
        if (item) {
            this.confirmed(item);
        }
        if (this.panel && this.panel.isVisible()) {
            this.cancel();
        }
    }

    confirmed (item) {
        const event = new MouseEvent('click');
        document.getElementById(item.projectId).dispatchEvent(event);
        this.cancel();
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

    cancel () {
        this.hide();
    }

    show () {
        this.storeFocusedElement();
        if (!this.panel) {
            this.panel = atom.workspace.addModalPanel({
                item: this
            });
        }
        this.disposables.add(
            this.filterEditorView.getModel().getBuffer().onDidStopChanging(this.onChange.bind(this))
        );
        this.panel.show();
        if (this.items.length > 0) {
            this.scrollToItemView(this.list.find('li:first'));
        }
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
            this.cancel();
        } else {
            this.populate(this.filterItems());
            this.show();
            this.focusFilterEditor();
        }
    }

    populate (items) {
        let models = [];
        if (Array.isArray(items) && items.length > 0) {
            models = items;
        }
        this.setItems(models);
    }

    filterItems (query) {
        let list = _utilities.fetchProjects();

        if (!list || list.length === 0) {
            return [];
        }

        if (!query) {
            return list;
        }

        return list.filter(
            (project) => {
                return project.projectName.includes(query);
            }
        );
    }

    getFilterKey () {
        if (this.getFilterQuery().length) {
            return 'projectName';
        }
        return '';
    }

    onChange () {
        if (this.focusFilterEditor) {
            this.populate(
                this.filterItems(this.getFilterQuery())
            );
        }
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
}

module.exports = PVSelectListView;
