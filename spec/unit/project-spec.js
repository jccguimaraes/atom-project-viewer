'use strict';

const expect = require('chai').expect;

const project = require('../../src/project');

context ('unit-test :: project', () => {

    beforeEach (() => {
        // this sets this.project to a clean state for each test
        this.project = project;
    });

    afterEach (() => {
        // this sets this.project to a clean state for each test
        delete this.project;
    });

    context ('#listAll', () => {

        it ('should be a method', () => {
            expect(this.project.listAll).to.be.a('function');
        });
    });

    context ('#listByClient', () => {

        it ('should be a method', () => {
            expect(this.project.listByClient).to.be.a('function');
        });
    });

    context ('#listByGroup', () => {

        it ('should be a method', () => {
            expect(this.project.listByGroup).to.be.a('function');
        });
    });

    context ('#listByName', () => {

        it ('should be a method', () => {
            expect(this.project.listByName).to.be.a('function');
        });
    });

});
