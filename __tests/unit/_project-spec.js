'use strict';

const expect = require('chai').expect;

const project = require('../../src/_project');

context ('unit-test :: project', function () {

  context ('#createModel', function () {

    it ('should be a public method', function () {
      expect(project.createModel).to.be.a('function');
    });

    context ('.projectId', function () {

      it ('should create an Id', function () {
        let model = project.createModel();
        expect(model.projectId).to.exist;
      });

      it ('should not allow to override the Id', function () {
        let model = project.createModel();
        const fn = function () {
          model.projectId = 'pv_' + Date.now();
        };
        expect(fn).to.throw(TypeError);
      });
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

    context ('.projectPaths', function () {

      it ('should add if valid path string', function () {
          let model = project.createModel();
          let path = '/my/path/to/project';
          expect(model.projectPaths).to.equal(null);
          model.projectPaths = path;
          expect(model.projectPaths).to.have.length(1);
          expect(model.projectPaths[0]).to.equal(path);
      });

      it ('should add if valid array of path strings', function () {
          let model = project.createModel();
          let path_1 = '/my/path/to/project_1';
          let path_2 = '/my/path/to/project_2';
          expect(model.projectPaths).to.equal(null);
          model.projectPaths = [path_1, path_2];
          expect(model.projectPaths).to.have.length(2);
          expect(model.projectPaths[0]).to.equal(path_1);
          expect(model.projectPaths[1]).to.equal(path_2);
      });

    });
  });

  context ('#createView', function () {

    it ('should be a public method', function () {
      expect(project.createView).to.be.a('function');
    });

    it ('should return a DOM Node', function () {
      let view = project.createView(project.createModel());
      expect(view).to.be.an.instanceof(HTMLElement);
    });

    it ('should render the view with no name', function () {
      let model = project.createModel();
      let view = project.createView(model);
      view.initialize();
      view.render();
      let viewName = view.textContent;
      expect(viewName).to.be.empty;
      let spanView = view.querySelector('span');
      expect(spanView).to.be.null;
    });

    it ('should render the view with a name', function () {
      let model = project.createModel();
      let view = project.createView(model);
      model.projectName = 'project #1';
      view.initialize();
      view.render();
      let viewName = view.textContent;
      expect(viewName).to.equal(model.projectName);
      let spanView = view.querySelector('span');
      expect(spanView).to.be.null;
    });

    it ('should render the view with icon but no name', function () {
      let model = project.createModel();
      let view = project.createView(model);
      model.projectIcon = 'icon-github';
      view.initialize();
      view.render();
      let viewName = view.textContent;
      expect(viewName).to.be.empty;
      let spanView = view.querySelector('span');
      expect(spanView.classList.contains(model.projectIcon)).to.be.true;
    });

    it ('should render the view with an icon and name', function () {
      let model = project.createModel();
      let view = project.createView(model);
      model.projectName = 'project #1';
      model.projectIcon = 'icon-github';
      view.initialize();
      view.render();
      let viewName = view.textContent;
      expect(viewName).to.equal(model.projectName);
      let spanView = view.querySelector('span');
      expect(spanView.classList.contains(model.projectIcon)).to.be.true;
    });

  });

});
