'use strict';

const expect = require('chai').expect;

const project = require('../../src/project');

context ('unit-test :: project', function () {

  context ('api', function () {

    context ('#createModel', function () {

      it ('is a public method', function () {
        expect(project.createModel).to.be.a('function');
      });

      context ('.projectName', function () {
        it ('should return null if no parameter passed', function () {
          let model = project.createModel();
          expect(model.projectName).to.be.null;
        });

        it ('should return undefined if parameter is a Number', function () {
          let model = project.createModel();
          model.projectName = 0;
          expect(model.projectName).to.be.undefined;
          model.projectName = 1;
          expect(model.projectName).to.be.undefined;
          model.projectName = 10;
          expect(model.projectName).to.be.undefined;
        });

        it ('should define the name if parameter is a string', function () {
          let model = project.createModel();
          model.projectName = '';
          expect(model.projectName).to.equal('');
          model.projectName = 'project';
          expect(model.projectName).to.equal('project');
          model.projectName = 'another project';
          expect(model.projectName).to.equal('another project');
        });

        it ('should redefine the name if already defined', function () {
          let model = project.createModel();
          model.projectName = 'project';
          expect(model.projectName).to.equal('project');
          model.projectName = '';
          expect(model.projectName).to.equal('');
          model.projectName = undefined;
          expect(model.projectName).to.be.undefined;
        });

        it ('should not redefine the name if already defined', function () {
          let model = project.createModel();
          model.projectName = 'project';
          expect(model.projectName).to.equal('project');
          model.projectName = 10;
          expect(model.projectName).to.equal('project');
        });

        it ('should define the names of multiple projects', function () {
          let model_1 = project.createModel();
          model_1.projectName = 'project 1';
          expect(model_1.projectName).to.equal('project 1');

          let model_2 = project.createModel();
          model_2.projectName = 'project 2';
          expect(model_2.projectName).to.equal('project 2');
        });

      });

      context ('.projectIcon', function () {
        it ('should return null if no parameter passed', function () {
          let model = project.createModel();
          expect(model.projectIcon).to.be.null;
        });

        it ('should return undefined if parameter is a Number', function () {
          let model = project.createModel();
          model.projectIcon = 0;
          expect(model.projectIcon).to.be.undefined;
          model.projectIcon = 1;
          expect(model.projectIcon).to.be.undefined;
          model.projectIcon = 10;
          expect(model.projectIcon).to.be.undefined;
        });

        it ('should set the name if parameter is a String', function () {
          let model = project.createModel();
          model.projectIcon = '';
          expect(model.projectIcon).to.equal('');
          model.projectIcon = 'icon';
          expect(model.projectIcon).to.equal('icon');
          model.projectIcon = 'another icon';
          expect(model.projectIcon).to.equal('another icon');
        });

        it ('should redefine the name if already defined', function () {
          let model = project.createModel();
          model.projectIcon = 'icon';
          expect(model.projectIcon).to.equal('icon');
          model.projectIcon = '';
          expect(model.projectIcon).to.equal('');
          model.projectIcon = undefined;
          expect(model.projectIcon).to.be.undefined;
        });

        it ('should not redefine the name if already defined', function () {
          let model = project.createModel();
          model.projectIcon = 'icon';
          expect(model.projectIcon).to.equal('icon');
          model.projectIcon = 10;
          expect(model.projectIcon).to.equal('icon');
        });

      });

    });

    context ('#createView', function () {

      it ('is a public method', function () {
        expect(project.createView).to.be.a('function');
      });

      it ('should return a DOM Node', function () {
        let view = project.createView(project.createModel());
        expect(view).to.be.an.instanceof(HTMLElement);
      });

    });

  });

});
