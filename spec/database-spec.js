'use strict';

const database = require('../src/_database');

describe ('database', function () {

  let spyOnAtomGetStorageFolderLoad;

  const atomGetStorageFolderFn = function _atomGetStorageFolderFn (result) {
    return {
      load: function () { return result; },
      storeSync: function (file, data) {
        require('fs-plus').writeFileSync(
          `${__dirname}/mocks/database`,
          JSON.stringify(data),
          'utf8'
        );
      }
    }
  }

  beforeEach (function () {
    spyOnAtomGetStorageFolderLoad = spyOn(atom, 'getStorageFolder');
  });

  it ('should return an empty array if no refresh', function () {
    expect(database.fetch()).toEqual([]);
  });

  it ('should not exist', function () {
    let returnValue = undefined;
    spyOnAtomGetStorageFolderLoad.andCallFake(
      atomGetStorageFolderFn.bind(this, returnValue)
    );
    expect(database.refresh()).toEqual([]);

  });

  it ('should exist but empty', function () {
    let returnValue = '';
    spyOnAtomGetStorageFolderLoad.andCallFake(
      atomGetStorageFolderFn.bind(this, returnValue)
    );
    expect(database.refresh()).toEqual([]);
  });

  it ('should exist but with wrong schema', function () {
    let returnValue = JSON.stringify({});
    spyOnAtomGetStorageFolderLoad.andCallFake(
      atomGetStorageFolderFn.bind(this, returnValue)
    );
    expect(database.refresh()).toEqual([]);
  });

  it ('should exist and with a good schema', function () {
    // mimic the atom.getStorageFolder().load
    const mockedRawDB = require('fs').readFileSync(
      `${__dirname}/mocks/database-raw`, 'utf8'
    );
    let returnValue = JSON.parse(mockedRawDB);
    spyOnAtomGetStorageFolderLoad.andCallFake(
      atomGetStorageFolderFn.bind(this, returnValue)
    );
    const store = database.refresh();
    expect(store.length).toBe(5);
  });

  describe ('the hierachy', function () {

    let mockedRawDB;
    let returnValue;

    beforeEach (function () {
      // mimic the atom.getStorageFolder().load
      mockedRawDB = require('fs').readFileSync(
        `${__dirname}/mocks/database-raw`, 'utf8'
      );
      returnValue = JSON.parse(mockedRawDB);
      spyOnAtomGetStorageFolderLoad.andCallFake(
        atomGetStorageFolderFn.bind(this, returnValue)
      );
    });

    it ('should have all prototypes defined', function () {
      const store = database.refresh();
      expect(Object.getPrototypeOf(store[0])).toBe(Object.prototype);
      expect(Object.getPrototypeOf(store[1])).toBe(store[0]);
      expect(Object.getPrototypeOf(store[2])).toBe(store[1]);
      expect(Object.getPrototypeOf(store[3])).toBe(store[0]);
      expect(Object.getPrototypeOf(store[4])).toBe(Object.prototype);
    });

    it ('should move a model from one parent to another', function () {
      const store = database.refresh();
      expect(Object.getPrototypeOf(store[2])).toBe(store[1]);
      const result = database.moveTo(store[2], store[0]);
      expect(result).toBe(true);
      expect(Object.getPrototypeOf(store[2])).toBe(store[0]);
    });

    fit ('should save and load the same content if no changes', function () {
      database.refresh();
      // mimic the atom.getStorageFolder().load
      const storedDB = JSON.parse(require('fs').readFileSync(
        `${__dirname}/mocks/database`, 'utf8'
      ));
      expect(returnValue).toEqual(storedDB);
    });

    it ('sould remove a model from a parent', function () {});

    it ('should update the local file', function () {
      const store = database.refresh();
      const oldStore = store.slice(0);
      database.moveTo(store[2], store[0]);
      database.update();
      expect(oldStore).not.toBe(store);
    });

  });
});
