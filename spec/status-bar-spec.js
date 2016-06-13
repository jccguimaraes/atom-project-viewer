'use strict';

const expect = require('chai').expect;

const StatusBar = require('../src/status-bar');

context ('status-bar consumed service', () => {

    beforeEach (() => {
        // this sets this.statusBar to a clean state for each test
        this.statusBar = StatusBar;

        this.statusBarName = 'status-bar';
        this.projectViewerName = 'project-viewer';
        this.statusBarNodeName = 'PV-STATUS-BAR';
    });

    afterEach (() => {
        // this sets this.statusBar to a clean state for each test
        this.statusBar.destroy();
        delete this.statusBar;
        delete this.statusBarName;
        delete this.statusBarNodeName;
    });

    it ('should have a method called initialize', () => {
        expect(this.statusBar.initialize).to.be.a('function');
    });

    it ('should have a method called destroy', () => {
        expect(this.statusBar.destroy).to.be.a('function');
    });

    it ('should have a method called getView', () => {
        expect(this.statusBar.getView).to.be.a('function');
    });

    it ('should have a method called renderView', () => {
        expect(this.statusBar.renderView).to.be.a('function');
    });

    it ('should initialize only once', () => {
        const init_1 = this.statusBar.initialize();
        const init_2 = this.statusBar.initialize();
        expect(init_1).to.be.an('object');
        expect(init_2).to.be.a('undefined');
        expect(init_1).not.to.be.equal(init_2);
    });

    it ('should render a view that\'s an instance of HTMLElement', () => {
        this.statusBar.initialize();
        const view = this.statusBar.renderView();
        expect(view).to.be.an.instanceof(HTMLElement);
    });

    it ('should get a view that\'s an instance of HTMLElement', () => {
        this.statusBar.initialize();
        this.statusBar.renderView();
        const view = this.statusBar.getView();
        expect(view).to.be.an.instanceof(HTMLElement);
    });

    it ('should get a view that\'s an instance of HTMLElement', () => {
        this.statusBar.initialize();
        this.statusBar.renderView();
        const view = this.statusBar.getView();
        this.statusBar.setLocation('Client / Group / Project');
        view.setLocation(this.statusBar.getLocation());
        console.debug(view);
        expect(view).to.be.an.instanceof(HTMLElement);
    });

    context ('status-bar is enabled', () => {

        beforeEach (() => {
            return atom.packages.activatePackage(this.statusBarName)
                .then(() => {
                    return atom.packages.activatePackage(this.projectViewerName);
                });
        });

        afterEach (() => {
            atom.packages.deactivatePackage(this.projectViewerName);
            atom.packages.deactivatePackage(this.statusBarName);
        });

        context ('should add a tile', () => {

            beforeEach(() => {
                this.activePackages = atom.packages.getActivePackages();
                this.projectViewerTile;
            });

            afterEach(() => {
                delete this.activePackages;
                delete this.projectViewerTile;
            });

            it ('if startupVisibility and statusBarVisibility is set to true', () => {
                atom.config.set('project-viewer.startupVisibility', true);
                atom.config.set('project-viewer.statusBarVisibility', true);

                this.activePackages.forEach((activePackage) => {
                    if (activePackage.name === this.statusBarName) {
                        this.projectViewerTile = activePackage.mainModule.statusBar.getRightTiles().filter(
                            (tile) => {
                                return tile.getItem().nodeName === this.statusBarNodeName;
                            }
                        );
                    }
                });

                expect(this.projectViewerTile.length).to.equal(1);
            });
        });

        context ('should not add a tile', () => {

            beforeEach(() => {
                this.activePackages = atom.packages.getActivePackages();
                this.projectViewerTile;
            });

            afterEach(() => {
                delete this.activePackages;
                delete this.projectViewerTile;
            });

            it ('if startupVisibility and statusBarVisibility is set to false', () => {
                atom.config.set('project-viewer.startupVisibility', false);
                atom.config.set('project-viewer.statusBarVisibility', false);

                this.activePackages.forEach((activePackage) => {
                    if (activePackage.name === this.statusBarName) {
                        this.projectViewerTile = activePackage.mainModule.statusBar.getRightTiles().filter(
                            (tile) => {
                                return tile.getItem().nodeName === this.statusBarNodeName;
                            }
                        );
                    }
                });

                expect(this.projectViewerTile.length).to.equal(0);
            });

            it ('or if statusBarVisibility is set to false', () => {
                atom.config.set('project-viewer.statusBarVisibility', false);

                this.activePackages.forEach((activePackage) => {
                    if (activePackage.name === this.statusBarName) {
                        this.projectViewerTile = activePackage.mainModule.statusBar.getRightTiles().filter(
                            (tile) => {
                                return tile.getItem().nodeName === this.statusBarNodeName;
                            }
                        );
                    }
                });

                expect(this.projectViewerTile.length).to.equal(0);
            });
        });
    });

    context ('status-bar is disabled', () => {
        beforeEach (() => {
            return atom.packages.activatePackage(this.projectViewerName);
        });

        context ('should not add a tile', () => {

            beforeEach(() => {
                this.activePackages = atom.packages.getActivePackages();
                this.projectViewerTile;
            });

            afterEach(() => {
                delete this.activePackages;
                delete this.projectViewerTile;
            });

            it ('if startupVisibility and statusBarVisibility is set to true', () => {
                atom.config.set('project-viewer.startupVisibility', true);
                atom.config.set('project-viewer.statusBarVisibility', true);

                this.activePackages.forEach((activePackage) => {
                    if (activePackage.name === this.statusBarName) {
                        this.projectViewerTile = activePackage.mainModule.statusBar.getRightTiles().filter(
                            (tile) => {
                                return tile.getItem().nodeName === this.statusBarNodeName;
                            }
                        );
                    }
                });

                expect(this.projectViewerTile).to.be.undefined;
            });
        });
    });

});
