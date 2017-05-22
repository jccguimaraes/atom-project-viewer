// =============================================================================
// requires
// =============================================================================

const fs = require('fs');

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

const move = function _move (movingItem, targetedItem, insertBefore) {
    // this is basic stuff
    if (!movingItem || !targetedItem) { return; }

    // does this actually happen? as in a DnD action? :see_no_evil:
    if (movingItem === targetedItem) { return; }

    // if `isBefore` is `undefined` this means that we are moving an item
    // to the targetItem's list and not near it
    // and the targetItem must be a group
    if (insertBefore === undefined && targetedItem.type !== 'group') { return; }

    let prototypeOfmovingItem;

    // if `isBefore` is `undefined` this means that we are moving an item
    // to the targetItem's list and not near it
    if (insertBefore === undefined) {
        prototypeOfmovingItem = Object.getPrototypeOf(movingItem);
    }

    // does this actually happen? as in a DnD action? :see_no_evil:
    if (prototypeOfmovingItem === targetedItem) {
        return;
    }

    let movingItemIdx = store.indexOf(movingItem);
    const movingItems = [movingItem];

    store.slice(movingItemIdx + 1).some(
      storeItem => {
        const storeItemPrototype = Object.getPrototypeOf(storeItem);

        // this means that no more children of movingItem
        if (movingItems.indexOf(storeItemPrototype) === -1) {
          return true;
        }

        // add to the moving items array
        if (movingItems.indexOf(storeItem) === -1) {
          movingItems.push(storeItem);
        }

        // and we remove from the store
        store.splice(store.indexOf(storeItem), 1);

        // keep searching
        return false;
      }
    );

    store.splice(movingItemIdx, 1);

    let targetedItemIdx = store.indexOf(targetedItem);
    let targetedItems = [targetedItem];
    let lastTargetedChildIdx = targetedItemIdx;

    store.slice(targetedItemIdx + 1).some(
      storeItem => {
        const storeItemPrototype = Object.getPrototypeOf(storeItem);

        if (targetedItems.indexOf(storeItemPrototype) === -1) {
          // this means that no more children of targetedItem
          return true;
        }

        // get the last child's index in the current store
        // this is a substore so internal index reference is not valid
        lastTargetedChildIdx++;

        // add to the targeted items array
        if (targetedItems.indexOf(storeItem) === -1) {
          targetedItems.push(storeItem);
        }

        // keep searching
        return false;
      }
    );

    switch (insertBefore) {
      case undefined:
        store.splice(lastTargetedChildIdx + 1, 0, ...movingItems);
        Object.setPrototypeOf(movingItem, targetedItem);
        break;
      case true:
        store.splice(targetedItemIdx, 0, ...movingItems);
        Object.setPrototypeOf(movingItem, Object.getPrototypeOf(targetedItem));
        break;
      case false:
        store.splice(lastTargetedChildIdx + 1, 0, ...movingItems);
        Object.setPrototypeOf(movingItem, Object.getPrototypeOf(targetedItem));
        break;
    }
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
