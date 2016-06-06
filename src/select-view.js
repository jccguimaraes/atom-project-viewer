'use strict';

const CompositeDisposable = require('atom').CompositeDisposable;

const SelectListView = require('atom-space-pen-views').SelectListView,
    $$ = require('atom-space-pen-views').$$;

const _utilities = require('./utilities');
const gateway = require('./gateway');

class PVSelectListView extends SelectListView {

    constructor () {
        super();
    }

    initialize () {

        this.disposables = new CompositeDisposable();

        this.setError('frak');
        this.setLoading('loading projects...');
        this.getEmptyMessage('couldn\'t find any projects');

        atom.commands.add(
            'atom-workspace',
            'project-viewer:toggle-select-view',
            this.toggle.bind(this)
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

    confirmed (item) {
        console.debug(item);
        // gateway.project.openOnTreeView(item);
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
        this.scrollToItemView(this.list.find('li:first'));
        this.focusFilterEditor();
    }

    hide () {
        if (this.panel) {
            this.list.empty();
            this.panel.hide();
            this.disposables.dispose();
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
        let list = gateway.project.fetchAll();

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
