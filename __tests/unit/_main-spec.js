'use strict';

const expect = require('chai').expect;

const main = require('../../src/_main');
const helpers = require('../../src/_helpers');
const group = require('../../src/_group');
const project = require('../../src/_project');

context ('unit-test :: main', function () {

  context ('#createGroup', function () {

    it ('should be a public method', function () {
      expect(main.createGroup).to.be.a('function');
    });

  });

  context ('#createView', function () {

    it ('should be a public method', function () {
      expect(main.createView).to.be.a('function');
    });

    it ('should return a DOM Node', function () {
      let view = main.createView(main.createGroup());
      expect(view).to.be.an.instanceof(HTMLElement);
    });

    it ('should initialize', function () {
      let mainModel = main.createGroup();
      let mainView = main.createView(mainModel);
      mainView.initialize();
      let childNodes = mainView.childNodes;
      expect(childNodes).to.have.length(2);
      expect(childNodes[0].tagName).to.equal('H1');
      expect(childNodes[1].tagName).to.equal('UL');
    });

    it ('should sort all children in the list', function () {
      let mainModel = main.createGroup();
      let mainView = main.createView(mainModel);
      mainView.initialize();

      const positionedChildName = ['Zebra', 'Alpha', 'Beta'];
      const alphabeticallyChildName = ['Alpha', 'Beta', 'Zebra'];

      let simpleNode1 = document.createElement('p');
      simpleNode1.textContent = positionedChildName[0];
      let simpleNode2 = document.createElement('p');
      simpleNode2.textContent = positionedChildName[1];
      let simpleNode3 = document.createElement('p');
      simpleNode3.textContent = positionedChildName[2];
      mainView.attachChild(simpleNode1);
      mainView.attachChild(simpleNode2);
      mainView.attachChild(simpleNode3);

      const positionedChildNodes = helpers.castToArray(
        mainView.querySelector('ul').childNodes
      );

      positionedChildNodes.forEach(
        (positionedOne, idx) => expect(
          positionedOne.textContent
        ).to.equal(positionedChildName[idx])
      );

      mainModel.mainSort = 'alphabetically';

      mainView.render();

      const alphabeticallyChildNodes = helpers.castToArray(
        mainView.querySelector('ul').childNodes
      );

      alphabeticallyChildNodes.forEach(
        (alphabeticallyOne, idx) => expect(
          alphabeticallyOne.textContent
        ).to.equal(alphabeticallyChildName[idx])
      );
    });

    it ('should detach a child', function () {
      let mainModel = main.createGroup();
      let mainView = main.createView(mainModel);
      mainView.initialize();

      let simpleNode1 = document.createElement('div');
      let simpleNode2 = document.createElement('p');
      mainView.attachChild(simpleNode1);
      mainView.attachChild(simpleNode2);

      expect(mainView.querySelector('ul').childNodes[0]).to.equal(simpleNode1);
      expect(mainView.querySelector('ul').childNodes[1]).to.equal(simpleNode2);

      mainView.detachChild(simpleNode1);
      expect(mainView.querySelector('ul').childNodes[0]).to.equal(simpleNode2);
      expect(mainView.querySelector('ul').childNodes[1]).to.be.undefined;
    });

  });

});
