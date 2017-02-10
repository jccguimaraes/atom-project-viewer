'use strict';

const database = require('../src/database');
const path = require('path');
const fs = require('fs');

xdescribe ('database', function () {
  //
  // let fsReadFileError;
  // let fsReadFileData;
  //
  // beforeEach (function () {
  //   spyOn(fs, 'readFile').andCallFake(function (file, options, cb) {
  //     cb(fsReadFileError, fsReadFileData);
  //   });
  //   spyOn(fs, 'writeFile').andCallFake(function (file, content) {
  //     // console.log(file, content);
  //   });
  //
  //   spyOn(atom.notifications, 'addError');
  //   spyOn(atom.notifications, 'addWarning');
  //   spyOn(atom.notifications, 'addSuccess');
  //
  //   spyOn(atom, 'open');
  // });

  it ('should open local file', function () {
    spyOn(atom, 'open');
    database.openDatabase();
    expect(atom.open).toHaveBeenCalledWith({
      pathsToOpen: path.join(atom.getConfigDirPath(), 'project-viewer.json'),
      newWindow: false
    });
  });

  describe ('subscription and unsubscription workflow', function () {

    it ('should subscribe and unsubscribe a callback', function () {
      const cb = jasmine.createSpy('subscribeCallBack');
      const unsubscription = database.subscribe(cb);
      database.runSubscribers();
      expect(cb).toHaveBeenCalled();
      cb.reset();

      const result = unsubscription();
      database.runSubscribers();

      expect(result).toBe(true);
      expect(cb).not.toHaveBeenCalled();
    });
  });

  describe ('directory watching', function () {
    const spy = spyOn(fs, 'watch');
    const pathArg = atom.getConfigDirPath();
    database.activate();
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.length).toEqual(1);
    expect(spy.calls[0].args[0]).toBe(pathArg);
    expect(typeof spy.calls[0].args[1]).toBe('function');
  });






  // it ('should return an empty array if no refresh', function () {
  //   expect(database.fetch()).toEqual([]);
  // });
  //
  // it ('should not exist', function () {
  //   fsReadFileError = {};
  //   database.refresh();
  //   expect(database.fetch()).toEqual([]);
  //   expect(atom.notifications.addWarning).toHaveBeenCalled();
  // });
  //
  // it ('should exist but empty', function () {
  //   fsReadFileError = null;
  //   fsReadFileData = '';
  //   database.refresh();
  //   expect(database.fetch()).toEqual([]);
  //   // expect(atom.notifications.addWarning).toHaveBeenCalled();
  // });
  //
  // it ('should exist but with wrong schema', function () {
  //   returnValue = JSON.stringify({});
  //   expect(database.refresh(returnValue)).toEqual([]);
  // });
  //
  // it ('should exist and with a good schema', function () {
  //   // mimic the atom.getStorageFolder().load
  //   const mockedRawDB = fs.readFileSync(
  //     `${__dirname}/mocks/project-viewer.json`, 'utf8'
  //   );
  //   returnValue = JSON.parse(mockedRawDB);
  //   const store = database.refresh(returnValue);
  //   expect(store.length).toBe(5);
  // });
  //
  // describe ('the hierachy', function () {
  //
  //   let mockedRawDB;
  //
  //   beforeEach (function () {
  //     // mimic the atom.getStorageFolder().load
  //     mockedRawDB = fs.readFileSync(
  //       `${__dirname}/mocks/project-viewer.json`, 'utf8'
  //     );
  //     returnValue = JSON.parse(mockedRawDB);
  //   });
  //
  //   it ('should have all prototypes defined', function () {
  //     const store = database.refresh(returnValue);
  //     expect(Object.getPrototypeOf(store[0])).toBe(Object.prototype);
  //     expect(Object.getPrototypeOf(store[1])).toBe(store[0]);
  //     expect(Object.getPrototypeOf(store[2])).toBe(store[1]);
  //     expect(Object.getPrototypeOf(store[3])).toBe(store[0]);
  //     expect(Object.getPrototypeOf(store[4])).toBe(Object.prototype);
  //   });
  //
  //   it ('should move a model from one parent to another', function () {
  //     const store = database.refresh(returnValue);
  //     expect(Object.getPrototypeOf(store[2])).toBe(store[1]);
  //     const result = database.moveTo(store[2], store[0]);
  //     expect(result).toBe(true);
  //     expect(Object.getPrototypeOf(store[2])).toBe(store[0]);
  //   });
  //
  //   it ('should save and load the same content if no changes', function () {
  //     const store = database.refresh(returnValue);
  //     const oldStore = store.slice(0);
  //     // database.save();
  //     expect(oldStore).toEqual(store);
  //   });
  //
  //   it ('should update the local file', function () {
  //     const store = database.refresh(returnValue);
  //     const oldStore = store.slice(0);
  //     database.moveTo(store[2], store[0]);
  //     expect(oldStore).not.toBe(store);
  //   });
  //
  //   it ('sould remove and/or add a model from a parent', function () {
  //     const store = database.refresh(returnValue);
  //     const oldStore = store.slice(0);
  //     const projectsDeleted = database.remove(store[2]);
  //     expect(oldStore).not.toEqual(store);
  //     expect(oldStore).toContain(projectsDeleted);
  //     expect(store).not.toContain(projectsDeleted);
  //
  //     database.addTo(projectsDeleted);
  //     expect(store).toContain(projectsDeleted);
  //
  //     const groupsDeleted = database.remove(store[0]);
  //     expect(oldStore).toContain(groupsDeleted);
  //     expect(store).not.toContain(groupsDeleted);
  //     database.addTo(groupsDeleted, projectsDeleted);
  //     expect(store).not.toContain(groupsDeleted);
  //     database.addTo(groupsDeleted);
  //     expect(store).toContain(groupsDeleted);
  //   });

  // });
});
