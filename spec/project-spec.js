'use strict';

const project = require('./../src/project');

describe ('project', function () {
    it ('should have following methods', function () {
        expect(project.fetchAllViews).toBeDefined();
        expect(typeof project.fetchAllViews).toEqual('function');
        expect(project.fetchModelByView).toBeDefined();
        expect(typeof project.fetchModelByView).toEqual('function');
        expect(project.fetchAllModels).toBeDefined();
        expect(typeof project.fetchAllModels).toEqual('function');
    });
});
