'use strict';

const expect = require('chai').expect;

context ('functional-test :: status-bar', () => {

    beforeEach (() => {
        this.statusBarName = 'status-bar';
        this.projectViewerName = 'project-viewer';
        this.statusBarNodeName = 'PV-STATUS-BAR';
    });

    afterEach (() => {
        delete this.statusBar;
        delete this.statusBarName;
        delete this.statusBarNodeName;
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
