'use strict';

const expect = require('chai').expect;

const colors = require('../../src/colors');

context ('unit-test :: colors', () => {

    beforeEach (() => {
        // this sets a clean state for each test
        this.colors = colors;
    });

    afterEach (() => {
        // this sets a clean state for each test
        this.colors.destroy();
        delete this.colors;
    });

    context ('#initialize', () => {

        it ('should be a method', () => {
            let expected = 'function';
            let result = this.colors.initialize;
            expect(result).to.be.a(expected);
        });

        it ('should initialize only once', () => {
            const init_1 = this.colors.initialize();
            const init_2 = this.colors.initialize();
            expect(init_1).to.be.an('object');
            expect(init_2).to.be.a('undefined');
            expect(init_1).not.to.be.equal(init_2);
        });
    });

    context ('#destroy', () => {

        it ('should be a method', () => {
            let expected = 'function';
            let result = this.colors.destroy;
            expect(result).to.be.a(expected);
        });

        it ('should destroy the object', () => {
            const init_1 = this.colors.initialize();
            expect(init_1).to.be.an('object');
            this.colors.destroy();
            const init_2 = this.colors.initialize();
            expect(init_2).to.be.a('object');
        });
    });

    context ('#setRule', () => {

        it ('should be a method', () => {
            let expected = 'function';
            let result = this.colors.setRule;
            expect(result).to.be.a(expected);
        });

        it ('should set a new rule', () => {
            let expected;
            let result;

            this.colors.initialize();

            this.colors.setRule('pv_1', 'client', '#fff');
            this.colors.setRule('pv_2', 'client', 'red');
            this.colors.setRule('pv_3', 'group', 'pink');
            this.colors.setRule('pv_1', 'client', '#ccc');
            this.colors.setRule('pv_4', 'project', 'yellow');

            expect(result).to.equal(expected);
        });

        it.skip ('should update an existing rule', () => {
            let expected;
            let result;
            expect(result).to.equal(expected);
        });
    });
});
