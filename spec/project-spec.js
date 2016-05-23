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

    describe ('fetchAllViews', function () {
        it ('should return a NodeList with length 0 if no views', function () {
            const result = project.fetchAllViews().length;
            const expected = 0;
            expect(result).toBe(expected);
        });

        it ('should return a NodeList with length 0 if no views', function () {
            const containerElement = document.createElement('project-viewer');
            const projectElement = document.createElement('li', 'pv-list-item');

            const result = project.fetchAllViews().length;
            const expected = 0;
            expect(result).toBe(expected);
        });

        it ('should return a NodeList with length 0 if no views', function () {
            const containerElement = document.createElement('project-viewer');
            const projectElement = document.createElement('li', 'pv-list-item');

            containerElement.appendChild(projectElement);

            const result = project.fetchAllViews(containerElement).length;
            const expected = 1;
            expect(result).toBe(expected);
        });
    });
});
