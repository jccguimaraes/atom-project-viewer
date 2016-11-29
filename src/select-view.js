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
        this.disposables.add(
            atom.commands.add(
                'atom-workspace', {
                    'core:move-up': this.selectPreviousItemView.bind(this),
                    'core:move-down': this.selectNextItemView.bind(this),
                    'core:confirm': this.confirmSelection.bind(this),
                    'core:cancel': this.cancelSelection.bind(this)
                }
            )
        );
        // let the atom-space-pen-views plugin manage the update and the filtering (fuzzy search) of the list with the native 'populateList' function
        this.disposables.add(
            this.filterEditorView.getModel().getBuffer().onDidChange(this.populateList.bind(this))
        );
        this.setLoading('Loading projects...');
    }

    getEmptyMessage () {
        return 'Couldn\'t find any projects';
    }

    destroy () {
        this.cancel();

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
      if (this.panel && !this.panel.isVisible()) {
          return;
      }
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
        const view = document.getElementById(item.projectId);
        if (view) {
          view.dispatchEvent(event);
        }
        this.cancel();
    }

    cancel () {
        this.filterEditorView.setText('');
        this.hide();
    }

    show () {
        if (!this.panel) {
            this.panel = atom.workspace.addModalPanel({
                item: this
            });
        }
        this.storeFocusedElement();
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

    cancelled () {
        this.cancel();
    }

    toggle () {
        if (this.panel && this.panel.isVisible()) {
            this.cancel();
        } else {
            this.populate();
            this.show();
            this.focusFilterEditor();
        }
    }

    populate () {
        this.setItems(_utilities.fetchProjects())
    }

    getFilterKey () {
        if (this.getFilterQuery().length) {
            return 'projectName';
        }
        return '';
    }

    viewForItem (item) {
        return $$(function() {
            return this.li({
                class: 'two-lines pv-select-view-li'
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
                    class: 'secondary-line no-icon'
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
