(function() {
    'use strict';

    // atoms
    const CompositeDisposable = require('atom').CompositeDisposable;
    // models
    const Constants = require('./helpers/constants');
    const Config = require('./helpers/config');
    const DataBase = require('./helpers/database');

    // views
    const MainView = require('./views/main-view');
    const AddProjectView = require('./views/add-project-view');
    const RemoveProjectView = require('./views/remove-project-view');
    const AddGroupView = require('./views/add-group-view');
    const RemoveGroupView = require('./views/remove-group-view');
    const EditGroupView = require('./views/edit-group-view');

    class MainModel {

        get config() {
            if (atom.config.getAll(Constants.app.package).length > 0) {
                for (var config in atom.config.getAll(Constants.app.package)[0].value) {
                    if (!Config.hasOwnProperty(config)) {
                        atom.config.unset(Constants.app.package + config);
                    }
                }
            }
            return Config;
        }

        activate(state) {

            function init() {
                this.initialize();
            }

            this.database = new DataBase();
            this.database.initialize().then(init.bind(this));

            this.disposables = new CompositeDisposable();

        }

        serialize() {
            return {
                message: 'hello'
            };
        }

        deactivate() {
            this.disposables.dispose();
        }

        initialize() {
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
                        'project-viewer:remove-group': this.removeGroup.bind(this),
                        'project-viewer:add-project': this.addProject.bind(this),
                        'project-viewer:remove-project': this.removeProject.bind(this),
                        'project-viewer:edit-file': this.openFile.bind(this)
                    }
                )
            );
        }

        serialize() {
            return {
                mainView: this.mainView.serialize()
            };
        }

        deactivate() {
            this.disposables.dispose();
            this.panel.destroy();
            this.mainView.destroy();
        }

        toggle() {
            if (this.panel.isVisible()) {
                this.panel.hide();
            } else {
                this.panel.show();
            }
        }

        addGroup() {
            if (this.modalElement) {
                this.modalElement.modal.destroy();
            }
            this.modalElement = new AddGroupView();
            this.modalElement.openModal();
        }

        removeGroup(element) {
            if (this.modalElement) {
                this.modalElement.modal.destroy();
            }
            this.modalElement = new RemoveGroupView();

            if (element && element.target && element.target.textContent) {
                this.modalElement.setDefaultGroup({
                    name: element.target.textContent
                });
            }
            this.modalElement.openModal();
        }

        editGroup(element) {
            if (this.modalElement) {
                this.modalElement.modal.destroy();
            }
            this.modalElement = new EditGroupView();

            if (element && element.target && element.target.textContent) {
                this.modalElement.setDefaultGroup({
                    name: element.target.textContent
                });
            }
            this.modalElement.openModal();
        }

        addProject(element) {
            if (this.modalElement) {
                this.modalElement.modal.destroy();
            }
            this.modalElement = new AddProjectView();
            if (element && element.target && element.target.textContent) {
                this.modalElement.setDefaultGroup({
                    name: element.target.textContent
                });
            }
            this.modalElement.openModal();
        }

        removeProject(element) {
            if (this.modalElement) {
                this.modalElement.modal.destroy();
            }
            this.modalElement = new RemoveProjectView();

            if (element && element.target && element.target.textContent) {
                this.modalElement.setDefaultProject({
                    name: element.target.textContent
                });
            }
            this.modalElement.openModal();
        }

        openFile() {
            DataBase.openFile();
        }
    }

    let mainModel = new MainModel();
    module.exports = mainModel;

}());
