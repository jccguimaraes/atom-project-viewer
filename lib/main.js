(function () {
    'use strict';

    let mainModel;

    // atoms
    const CompositeDisposable = require('atom').CompositeDisposable,
    // models
        Constants = require('./helpers/constants'),
        Config = require('./helpers/config'),
        DataBase = require('./helpers/database'),

    // views
        MainView = require('./views/main-view'),
        AddProjectView = require('./views/add-project-view'),
        RemoveProjectView = require('./views/remove-project-view'),
        AddGroupView = require('./views/add-group-view'),
        RemoveGroupView = require('./views/remove-group-view'),
        EditGroupView = require('./views/edit-group-view');

    class MainModel {

        get config () {
            let config;
            if (atom.config.getAll(Constants.app.package).length > 0) {
                for (config in atom.config.getAll(Constants.app.package)[0].value) {
                    if (!Config.hasOwnProperty(config)) {
                        atom.config.unset(Constants.app.package + config);
                    }
                }
            }
            return Config;
        }

        activate () {

            function init() {
                this.initialize();
            }

            this.database = new DataBase();
            this.database.initialize().then(init.bind(this));

            this.disposables = new CompositeDisposable();

        }

        initialize () {
            this.mainView = new MainView();
            this.panel = atom.workspace.addRightPanel({
                item: this.mainView,
                visible: atom.config.get('project-viewer.startUp')
            });

            this.disposables.add(
                atom.commands.add(
                    'atom-workspace',
                    {
                        'project-viewer:toggle': this.toggle.bind(this),
                        'project-viewer:add-group': this.addGroup.bind(this),
                        'project-viewer:edit-group': this.editGroup.bind(this),
                        'project-viewer:remove-group': this.removeGroup.bind(this),
                        'project-viewer:add-project': this.addProject.bind(this),
                        'project-viewer:remove-project': this.removeProject.bind(this),
                        'project-viewer:edit-file': this.openFile.bind(this)
                    }
                )
            );
        }

        deactivate () {
            this.disposables.dispose();
            this.panel.destroy();
            this.mainView.destroy();
        }

        toggle () {
            if (this.panel.isVisible()) {
                this.panel.hide();
            } else {
                this.panel.show();
            }
        }

        addGroup () {
            if (this.modalElement) {
                this.modalElement.modal.destroy();
            }
            this.modalElement = new AddGroupView();
            this.modalElement.openModal();
        }

        removeGroup (element) {
            if (this.modalElement) {
                this.modalElement.modal.destroy();
            }
            this.modalElement = new RemoveGroupView();

            if (element && element.target && element.target.querySelector('.list-item') &&
                element.target.querySelector('.list-item').textContent) {
                this.modalElement.setDefaultGroup({
                    name: element.target.querySelector('.list-item').textContent
                });
            } else if (element && element.target && element.target.textContent) {
                this.modalElement.setDefaultGroup({
                    name: element.target.textContent
                });
            }
            this.modalElement.openModal();
        }

        editGroup (element) {
            if (this.modalElement) {
                this.modalElement.modal.destroy();
            }
            this.modalElement = new EditGroupView();

            if (element && element.target && element.target.querySelector('.list-item') &&
                element.target.querySelector('.list-item').textContent) {
                this.modalElement.editGroup({
                    name: element.target.querySelector('.list-item').textContent
                });
            } else if (element && element.target && element.target.textContent) {
                this.modalElement.editGroup({
                    name: element.target.textContent
                });
            }
            this.modalElement.openModal();
        }

        addProject (element) {
            let target,
                attributes,
                hasGroupName,
                hasProjectName,
                groupName/*,
                projectName*/;

            function fetchAttributes(attrs, el) {
                attrs.forEach(function (attribute) {
                    if (el.attributes[attribute].nodeName === 'data-group') {
                        groupName = el.attributes[attribute].nodeValue;
                        // } else if (el.attributes[attribute].nodeName === 'data-project') {
                        //     projectName = el.attributes[attribute].nodeValue;
                    }
                });
            }

            target = element.target;
            attributes = Object.keys(target.attributes);
            fetchAttributes(attributes, target);

            if (!hasGroupName || !hasProjectName) {
                target = target.parentElement;
                attributes = Object.keys(target.attributes);
                fetchAttributes(attributes, target);
            }

            if (this.modalElement) {
                this.modalElement.modal.destroy();
            }
            this.modalElement = new AddProjectView();

            this.modalElement.setDefaultGroup({
                name: groupName
            });

            this.modalElement.openModal();
        }

        removeProject (element) {
            if (this.modalElement) {
                this.modalElement.modal.destroy();
            }
            this.modalElement = new RemoveProjectView();

            if (element && element.target && element.target.querySelector('.list-item-') &&
                element.target.querySelector('.list-item').textContent) {
                this.modalElement.setDefaultProject({
                    name: element.target.querySelector('.list-item').textContent
                });
            } else if (element && element.target && element.target.textContent) {
                this.modalElement.setDefaultProject({
                    name: element.target.textContent
                });
            }
            this.modalElement.openModal();
        }

        openFile () {
            DataBase.openFile();
        }
    }

    mainModel = new MainModel();
    module.exports = mainModel;
}());
