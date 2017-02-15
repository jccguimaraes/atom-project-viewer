'use strict';

const fs = require('fs');
const database = require('../src/db');

describe ('database', function () {

  const toBeMethod = function _toBeMethod() {
    return typeof this.actual === 'function';
  }

  beforeEach(function () {
    this.addMatchers({
      toBeMethod
    });
  });

  it ('should have the following methods', function () {
    expect(database.initialize).toBeMethod();
    expect(database.destroy).toBeMethod();
    expect(database.addToStore).toBeMethod();
    expect(database.removeFromStore).toBeMethod();
    expect(database.moveInStore).toBeMethod();
  });

  describe ('store workflow', function () {

    beforeEach(function () {});

    it ('should add an unique item', function () {
      // database.addToStore();
    });

    it ('should remove an item', function () {
      // database.removeFromStore();
    });

    it ('should move an item inside', function () {
      // database.moveInStore();
    });

    describe('moving items in the store', function () {
      // note: this is one of the most important
      // test case suit in this module, don't let your OCD get to you!
      let item_1, item_2, item_3, item_4, item_5;
      let item_6, item_7, item_8, item_9, item_10;

      beforeEach(function () {
        item_1 = {type: 'group', name: 'group #1'};
        item_2 = {type: 'group', name: 'group #1.1'};
        item_3 = {type: 'project', name: 'project #1.1'};
        item_4 = {type: 'group', name: 'group #1.1.1'};
        item_5 = {type: 'project', name: 'project #1.1.1'};
        item_6 = {type: 'group', name: 'group #2'};
        item_7 = {type: 'group', name: 'group #2.1'};
        item_8 = {type: 'project', name: 'project #2.1'};
        item_9 = {type: 'group', name: 'group #2.1.1'};
        item_10 = {type: 'project', name: 'project #2.1.1'};

        Object.setPrototypeOf(item_1, Object.prototype);
        Object.setPrototypeOf(item_2, item_1);
        Object.setPrototypeOf(item_3, item_2);
        Object.setPrototypeOf(item_4, item_2);
        Object.setPrototypeOf(item_5, item_4);
        Object.setPrototypeOf(item_6, Object.prototype);
        Object.setPrototypeOf(item_7, item_6);
        Object.setPrototypeOf(item_8, item_7);
        Object.setPrototypeOf(item_9, item_7);
        Object.setPrototypeOf(item_10, item_9);

        database.clearStore();

        database.addToStore([
          item_1, item_2, item_3, item_4, item_5,
          item_6, item_7, item_8, item_9, item_10
        ]);
      });

      it ('should not move anything', function () {
        const storeAfter = [
          item_1, item_2, item_3, item_4, item_5,
          item_6, item_7, item_8, item_9, item_10
        ]
        database.move();
        expect(database.listStore()).toEqual(storeAfter);
      });

      it ('should not move item_3 when moving to item_8', function () {
        const storeAfter = [
          item_1, item_2, item_3, item_4, item_5,
          item_6, item_7, item_8, item_9, item_10
        ]
        database.move(item_3, item_8);
        expect(database.listStore()).toEqual(storeAfter);
      });

      it ('should place item_3 in item_4', function () {
        const storeAfter = [
          item_1, item_2, item_4, item_5, item_3,
          item_6, item_7, item_8, item_9, item_10
        ]
        database.move(item_3, item_4);
        expect(database.listStore()).toEqual(storeAfter);
      });

      it ('should place item_4 in item_7', function () {
        const storeAfter = [
          item_1, item_2, item_3, item_6, item_7,
          item_8, item_9, item_10, item_4, item_5
        ]
        database.move(item_4, item_7);
        expect(database.listStore()).toEqual(storeAfter);
      });

      it ('should place item_3 after item_8', function () {
        const storeAfter = [
          item_1, item_2, item_4, item_5, item_6,
          item_7, item_8, item_3, item_9, item_10
        ]
        database.move(item_3, item_8, false);
        expect(database.listStore()).toEqual(storeAfter);
      });

      it ('should place item_3 before item_8', function () {
        const storeAfter = [
          item_1, item_2, item_4, item_5, item_6,
          item_7, item_3, item_8, item_9, item_10
        ]
        database.move(item_3, item_8, true);
        expect(database.listStore()).toEqual(storeAfter);
      });

      it ('should place item_4 after item_8', function () {
        const storeAfter = [
          item_1, item_2, item_3, item_6, item_7,
          item_8, item_4, item_5, item_9, item_10
        ]
        database.move(item_4, item_8, false);
        expect(database.listStore()).toEqual(storeAfter);
      });

      it ('should place item_4 before item_8', function () {
        const storeAfter = [
          item_1, item_2, item_3, item_6, item_7,
          item_4, item_5, item_8, item_9, item_10
        ]
        database.move(item_4, item_8, true);
        expect(database.listStore()).toEqual(storeAfter);
      });

      it ('should place item_2 after item_9', function () {
        const storeAfter = [
          item_1, item_6, item_7, item_8, item_9,
          item_10, item_2, item_3, item_4, item_5
        ]
        database.move(item_2, item_9, false);
        expect(database.listStore()).toEqual(storeAfter);
      });

      it ('should place item_2 before item_9', function () {
        const storeAfter = [
          item_1, item_6, item_7, item_8, item_2,
          item_3, item_4, item_5, item_9, item_10
        ]
        database.move(item_2, item_9, true);
        expect(database.listStore()).toEqual(storeAfter);
      });

      it ('should place item_7 after item_3', function () {
        const storeAfter = [
            item_1, item_2, item_3, item_7, item_8,
            item_9, item_10, item_4, item_5, item_6
        ]
        database.move(item_7, item_3, false);
        expect(database.listStore()).toEqual(storeAfter);
      });

      it ('should place item_7 before item_3', function () {
        const storeAfter = [
            item_1, item_2, item_7, item_8, item_9,
            item_10, item_3, item_4, item_5, item_6
        ]
        database.move(item_7, item_3, true);
        expect(database.listStore()).toEqual(storeAfter);
      });
    });
  });

  describe ('directory watcher', function () {

    const fsWatchClose = jasmine.createSpy('fsWatchClose');

    beforeEach(function () {
      spyOn(fs, 'watch').andReturn({
        close: fsWatchClose
      });

      spyOn(atom.notifications, 'addError');
      spyOn(atom.notifications, 'addSuccess');
    });

    it ('should start watching the directory', function () {
      expect(database._watcher).toBeUndefined();
      database._startWatcher();
      expect(fs.watch.callCount).toBe(1);
      expect(fs.watch).toHaveBeenCalledWith(
        atom.getConfigDirPath(),
        database._watcherAware
      );
      expect(database._watcher).not.toBeUndefined();
    });

    it ('should stop watching the directory', function () {
      database._startWatcher();
      database._closeWatcher();
      expect(fsWatchClose).toHaveBeenCalled();
      expect(database._watcher).toBeUndefined();
    });

    it ('should _watcherAware', function () {
      let eventType;
      let filename;
      let result;

      result = database._watcherAware(eventType, filename);
      expect(result).toBeUndefined();

      filename = 'dummy-file';
      result = database._watcherAware(eventType, filename);
      expect(result).toBeUndefined();

      filename = 'project-viewer.js';
      result = database._watcherAware(eventType, filename);
      expect(result).toBeUndefined();

      eventType = 'change';
      filename = 'project-viewer.js';
      result = database._watcherAware(eventType, filename);
      expect(result).toBeUndefined();

      eventType = 'rename';
      filename = 'project-viewer.js';
      result = database._watcherAware(eventType, filename);
      expect(result).toBe(true);
    })
  });
});
