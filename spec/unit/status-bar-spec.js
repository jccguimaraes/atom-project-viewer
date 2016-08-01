'use strict';

return;

const expect = require('chai').expect;

const statusBar = require('../../src/status-bar');

context ('unit-test :: status-bar', () => {

    beforeEach (() => {
        // this sets this.statusBar to a clean state for each test
        this.statusBar = statusBar;

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
        expect(view).to.be.an.instanceof(HTMLElement);
    });

});
