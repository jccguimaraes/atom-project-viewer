'use strict';

const expect = require('chai').expect;

const helpers = require('../../src/_helpers');

context ('unit-test :: helpers', function () {

  context ('#sortArray', function () {

    it ('should be a public method', function () {
      expect(helpers.sortArray).to.be.a('function');
    });

    it ('should return undefined if empty', function () {
      const result = helpers.sortArray();
      expect(result).to.be.undefined;
    });

    it ('should return null if not an array', function () {
      const result = helpers.sortArray({});
      expect(result).to.be.null;
    });

    it ('should sort an array', function () {
      const input = ['áctions', 'balls', 'apply', 'things', 'action'];
      const expected = ['action', 'áctions', 'apply', 'balls', 'things'];
      const result = helpers.sortArray(input);
      expect(result).to.be.a('array');
      expect(result).to.deep.equal(expected);
    });

    it ('should sort an array reversed', function () {
      const input = ['áctions', 'balls', 'apply', 'things', 'action'];
      const expected = ['things', 'balls', 'apply', 'áctions', 'action'];
      const result = helpers.sortArray(
        input,
        { reversed: true }
      );
      expect(result).to.be.a('array');
      expect(result).to.deep.equal(expected);
    });

    it ('should sort an array of objects by specific property', function () {
      const input = [
        { id: 1, name: 'áctions' },
        { id: 2, name: 'balls' },
        { id: 3, name: 'apply' },
        { id: 4, name: 'things' },
        { id: 5, name: 'action' }
      ];
      const expected = [
        { id: 5, name: 'action' },
        { id: 1, name: 'áctions' },
        { id: 3, name: 'apply' },
        { id: 2, name: 'balls' },
        { id: 4, name: 'things' }
      ];
      const result = helpers.sortArray(
        input,
        { byProperty: 'name' }
      );
      expect(result).to.be.a('array');
      expect(result).to.deep.equal(expected);
    });

    it ('should sort an array of objects by reversed property', function () {
      const input = [
        { id: 1, name: 'áctions' },
        { id: 2, name: 'balls' },
        { id: 3, name: 'apply' },
        { id: 4, name: 'things' },
        { id: 5, name: 'action' }
      ];
      const expected = [
        { id: 4, name: 'things' },
        { id: 2, name: 'balls' },
        { id: 3, name: 'apply' },
        { id: 1, name: 'áctions' },
        { id: 5, name: 'action' }
      ];
      const result = helpers.sortArray(
        input,
        { reversed: true, byProperty: 'name' }
      );
      expect(result).to.be.a('array');
      expect(result).to.deep.equal(expected);
    });

  });

  context ('#castToArray', function () {

    it ('should cast any type of object to an array', function () {
      let soonArray = {};
      soonArray = helpers.castToArray(undefined);
      expect(soonArray).to.be.a('array');
      soonArray = helpers.castToArray(null);
      expect(soonArray).to.be.a('array');
      soonArray = helpers.castToArray({});
      expect(soonArray).to.be.a('array');
    });

  });

});
