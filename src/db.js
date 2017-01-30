'use strict';

// =============================================================================
// requires
// =============================================================================

const  fs = require('fs');

// =============================================================================
// properties
// =============================================================================

const dbfile = 'project-viewer.js';
const store = [];
let _worker;

// =============================================================================
// methods
// =============================================================================

/**
 *
 * @private
 * @since 1.0.0
 */
const _watcherAware = function _watcherAware (eventType, filename) {
  if (!eventType || filename !== dbfile) { return; }
  if (eventType === 'change') { return; }
  return true;
};

/**
 *
 * @private
 * @since 1.0.0
 */
const _startWatcher = function _startWatcher () {
  this._closeWatcher();
  this._watcher = fs.watch(
    atom.getConfigDirPath(),
    this._watcherAware
  );
};

/**
 *
 * @private
 * @since 1.0.0
 */
const _closeWatcher = function _closeWatcher () {
  if (!this._watcher) { return; }
  this._watcher.close();
  this._watcher = undefined;
  return true;
};

/**
 *
 * @public
 * @since 1.0.0
 */
const initialize = function _initialize () {};

/**
 *
 * @since 1.0.0
 */
const destroy = function _destroy () {};

/**
 *
 * @public
 * @since 1.0.0
 */
const listStore = function _listStore () {
  return store;
};

/**
 *
 * @public
 * @since 1.0.0
 */
const clearStore = function _clearStore () {
  store.length = 0;
};

/**
 *
 * @public
 * @since 1.0.0
 */
const addToStore = function _addToStore (entry/*, delegator*/) {
  if (!entry) return;
  if (Array.isArray(entry)) {
    entry.forEach(this.addToStore);
    return;
  }
  // if (delegator)
  // return entry;
  store.push(entry);
};

/**
 *
 * @public
 * @since 1.0.0
 */
const removeFromStore = function _removeFromStore (entry) {
  return entry;
};

/**
 *
 * @public
 * @since 1.0.0
 */
const moveInStore = function _moveInStore (entry, delegator) {
  if (delegator)
  return entry;
};

const move = function _move(moveItem, nextToItem, insertBefore) {
    if (moveItem === nextToItem) { return; }
    var moveItemIdx = store.indexOf(moveItem);
    var nextToItemIdx = store.indexOf(nextToItem);
    var moveDownwards = moveItemIdx < nextToItemIdx;
    //var protoOfMoveItem = Object.getPrototypeOf(moveItem);
    //var protoOfNextToItem = Object.getPrototypeOf(nextToItem);
    //var protoOfMoveItemIdx = store.indexOf(protoOfMoveItem);
    //var protoOfNextToItemIdx = store.indexOf(protoOfNextToItem);

    var moveItemSubStoreChildren = [];
    var nextToItemSubStoreChildren = [];

    store.slice( (moveDownwards ? moveItemIdx: nextToItemIdx), (moveDownwards ? nextToItemIdx + 1 : moveItemIdx + 1 ) ).some(
        (item, idx) => {
            var result = idx === 0 ? true : moveItemSubStoreChildren.indexOf(Object.getPrototypeOf(item)) !== -1;
            if (result) {
                moveItemSubStoreChildren.push(item);
                moveDownwards && store.splice(store.indexOf(item), 1);
            }
            return !result;
        }
    );

    if (moveDownwards) {
      nextToItemIdx = store.indexOf(nextToItem);
    }

    (!moveDownwards || !insertBefore) && store.slice( (moveDownwards ? nextToItemIdx : moveItemIdx) ).some(
        (item, idx) => {
            var result = idx === 0 ? true : nextToItemSubStoreChildren.indexOf(Object.getPrototypeOf(item)) !== -1;
            if (result) {
                nextToItemSubStoreChildren.push(item);
                !moveDownwards && store.splice(store.indexOf(item), 1);
            }
            return !result;
        }
    );

    let insertAtIndex = nextToItemIdx;

    for(let putIdx = nextToItemIdx + 1; putIdx < store.length; putIdx++) {
      var result = (moveDownwards ? nextToItemSubStoreChildren : moveItemSubStoreChildren).indexOf(Object.getPrototypeOf(store[putIdx])) === -1;
      if (!result) {
        insertAtIndex = putIdx;
        break;
      }
    }
    store.splice(insertAtIndex + (insertBefore ? 0 : 1), 0, ...(moveDownwards ? moveItemSubStoreChildren : nextToItemSubStoreChildren));
};

// =============================================================================
// instantiation
// =============================================================================

const database = {
  // properties
  _worker,
  // privates
  _watcherAware,
  _startWatcher,
  _closeWatcher,
  // publics
  initialize,
  destroy,
  clearStore,
  listStore,
  addToStore,
  removeFromStore,
  moveInStore,
  move
};

/**
 * Database / Store module
 * @module database
 */
module.exports = database;
