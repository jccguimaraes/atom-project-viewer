'use strict';

const expect = require('chai').expect;

const group = require('../../src/_group');
const project = require('../../src/_project');
const helpers = require('../../src/_helpers');

context ('unit-test :: group', function () {

  context ('#createGroup', function () {

    it ('should be a public method', function () {
      expect(group.createGroup).to.be.a('function');
    });

    context ('.groupId', function () {

      it ('should create an Id', function () {
        let model = group.createGroup();
        expect(model.groupId).to.exist;
      });

      it ('should not allow to override the Id', function () {
        let model = group.createGroup();
        const fn = function () {
          model.groupId = 'pv_' + Date.now();
        };
        expect(fn).to.throw(TypeError);
      });
    });

    context ('.groupSort', function () {

      it ('should start as position', function () {
        let model = group.createGroup();
        expect(model.groupSort).to.equal('position');
      });

      it ('should switch to alphabetically', function () {
        let model = group.createGroup();
        model.groupSort = 'alphabetically';
        expect(model.groupSort).to.equal('alphabetically');
      });

      it ('should not switch to other types', function () {
        let model = group.createGroup();
        model.groupSort = 'other sorting';
        expect(model.groupSort).to.equal('position');
      });
    });

    context ('.groupName', function () {
      it ('should return null if no parameter passed', function () {
        let model = group.createGroup();
        expect(model.groupName).to.be.null;
      });

      it ('should return undefined if parameter is a Number', function () {
        let model = group.createGroup();
        model.groupName = 0;
        expect(model.groupName).to.be.undefined;
        model.groupName = 1;
        expect(model.groupName).to.be.undefined;
        model.groupName = 10;
        expect(model.groupName).to.be.undefined;
      });

      it ('should define the name if parameter is a string', function () {
        let model = group.createGroup();
        model.groupName = '';
        expect(model.groupName).to.equal('');
        model.groupName = 'group';
        expect(model.groupName).to.equal('group');
        model.groupName = 'another group';
        expect(model.groupName).to.equal('another group');
      });

      it ('should redefine the name if already defined', function () {
        let model = group.createGroup();
        model.groupName = 'group';
        expect(model.groupName).to.equal('group');
        model.groupName = '';
        expect(model.groupName).to.equal('');
        model.groupName = undefined;
        expect(model.groupName).to.be.undefined;
      });

      it ('should not redefine the name if already defined', function () {
        let model = group.createGroup();
        model.groupName = 'group';
        expect(model.groupName).to.equal('group');
        model.groupName = 10;
        expect(model.groupName).to.equal('group');
      });

      it ('should define the names of multiple groups', function () {
        let model_1 = group.createGroup();
        model_1.groupName = 'group 1';
        expect(model_1.groupName).to.equal('group 1');

        let model_2 = group.createGroup();
        model_2.groupName = 'group 2';
        expect(model_2.groupName).to.equal('group 2');
      });

    });

    context ('.groupIcon', function () {
      it ('should return null if no parameter passed', function () {
        let model = group.createGroup();
        expect(model.groupIcon).to.be.null;
      });

      it ('should return undefined if parameter is a Number', function () {
        let model = group.createGroup();
        model.groupIcon = 0;
        expect(model.groupIcon).to.be.undefined;
        model.groupIcon = 1;
        expect(model.groupIcon).to.be.undefined;
        model.groupIcon = 10;
        expect(model.groupIcon).to.be.undefined;
      });

      it ('should set the name if parameter is a String', function () {
        let model = group.createGroup();
        model.groupIcon = '';
        expect(model.groupIcon).to.equal('');
        model.groupIcon = 'icon';
        expect(model.groupIcon).to.equal('icon');
        model.groupIcon = 'another icon';
        expect(model.groupIcon).to.equal('another icon');
      });

      it ('should redefine the name if already defined', function () {
        let model = group.createGroup();
        model.groupIcon = 'icon';
        expect(model.groupIcon).to.equal('icon');
        model.groupIcon = '';
        expect(model.groupIcon).to.equal('');
        model.groupIcon = undefined;
        expect(model.groupIcon).to.be.undefined;
      });

      it ('should not redefine the name if already defined', function () {
        let model = group.createGroup();
        model.groupIcon = 'icon';
        expect(model.groupIcon).to.equal('icon');
        model.groupIcon = 10;
        expect(model.groupIcon).to.equal('icon');
      });

    });
  });

  context ('#createView', function () {

    it ('should be a public method', function () {
      expect(group.createView).to.be.a('function');
    });

    it ('should return a DOM Node', function () {
      let view = group.createView(group.createGroup());
      expect(view).to.be.an.instanceof(HTMLElement);
    });

    it ('should render the view with no name', function () {
      let model = group.createGroup();
      let view = group.createView(model);
      view.initialize();
      view.render();
      let viewName = view.querySelector('.list-item').textContent;
      expect(viewName).to.be.empty;
    });

    it ('should render the view with icon but no name', function () {
      let model = group.createGroup();
      let view = group.createView(model);
      model.groupIcon = 'icon-github';
      view.initialize();
      view.render();
      let viewName = view.querySelector('.list-item span').textContent;
      expect(viewName).to.be.empty;
    });

    it ('should render the view with the name', function () {
      let model = group.createGroup();
      let view = group.createView(model);
      model.groupName = 'group #1';
      view.initialize();
      view.render();
      let viewName = view.querySelector('.list-item').textContent;
      expect(viewName).to.be.equal(model.groupName);
    });

    it ('should render the view with icon and name', function () {
      let model = group.createGroup();
      let view = group.createView(model);
      model.groupName = 'group #1';
      model.groupIcon = 'icon-github';
      view.initialize();
      view.render();
      let viewName = view.querySelector('.list-item span').textContent;
      expect(viewName).to.be.equal(model.groupName);
    });

    it ('should render position', function () {
      let model = group.createGroup();
      let view = group.createView(model);
      view.initialize();
      view.render();
      let viewNode = view.querySelector('.list-tree');
      expect(viewNode.nodeName).to.be.equal('UL');
      view.render();
      expect(viewNode.nodeName).to.be.equal('UL');
    });

    it ('should render and sort a list', function () {
      let model = group.createGroup();
      let view = group.createView(model);
      model.groupName = 'group #1';
      view.initialize();

      const childNames = ['Things', 'Actions', 'Zebra', 'Áctions'];
      const AlphaChildNames = ['Actions', 'Áctions', 'Things', 'Zebra'];

      for (let i=0; i< childNames.length; i++) {
        let childModel = project.createGroup();
        let childView = project.createView(childModel);
        childModel.projectName = childNames[i];
        if ([1, 3].indexOf(i) !== -1) {
          childModel.projectIcon = 'icon-github';
        }
        childView.initialize();
        childView.render();
        view.attachChild(childView);
      }
      view.render();

      const positionedChildNodes = helpers.castToArray(
        view.querySelector('ul').childNodes
      );
      positionedChildNodes.forEach(
        (positionedOne, idx) => expect(
          positionedOne.sorting()
        ).to.equal(childNames[idx])
      );
      model.groupSort = 'alphabetically';
      view.render();

      const alphabeticallyChildNodes = helpers.castToArray(
        view.querySelector('ul').childNodes
      );
      alphabeticallyChildNodes.forEach(
        (alphabeticallyOne, idx) => expect(
          alphabeticallyOne.sorting()
        ).to.equal(AlphaChildNames[idx])
      );
    });

  });

});
