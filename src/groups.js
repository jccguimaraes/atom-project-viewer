'use strict';

/**
 * Description.
 * @private
 */
const CompositeDisposable = require('atom').CompositeDisposable,
    Emitter = require('atom').Emitter,
    Helpers = require('./helpers'),
    // Database = require('./database'),
    Group = require('./group'),
    privates = new WeakMap();

/**
 * Set changes in the private variable.
 * @private
 * @param {string} property - The name of the variable.
 * @param {string|number} value - The name of the variable.
 */
function save(property, value) {
    let props = privates.get(this);
    props[property] = value;
    privates.set(this, props);
}

/**
 * Get a private variable.
 * @private
 * @param {string} property - The name of the variable.
 * @return {string|number} ...
 */
function fetch(property) {
    return privates.get(this)[property];
}

/**
 * A representation of a pool of groups
 */
class Groups {

    /**
     * Initializes the private variables
     * @public
     */
    constructor () {
        this.disposables = new CompositeDisposable();

        this.disposables.add(
            atom.views.addViewProvider({
                modelConstructor: Groups,
                viewConstructor: require('./groups-element')
            })
        );

        this.emitter = new Emitter();

        privates.set(this, {
            pool: [],
            mapper: {}
        });
    }

    setGroups (groups) {
        this.groups.forEach((group) => {
            this.unregister(group);
        });

        atom.views.getView(this).clear();

        groups.forEach((candidate) => {
            let group;

            if (candidate.name === '') {
                candidate.name = 'ungrouped';
            }

            group = new Group(candidate);
            this.register(group);

            group.onDidSetAsSelected((whichGroup) => {
                console.debug(whichGroup);
            });

            atom.views.getView(this).appendGroup(group);
        });
    }

    get groups () {
        return fetch.call(this, 'pool');
    }

    /**
     * Returns the total groups in the pool.
     * @public
     * @return {number} The number of groups in the pool.
     */
    get total () {
        return this.groups.length;
    }

    /**
     * Registers a group from the pool.
     * @public
     */
    register (group) {
        let pool = fetch.call(this, 'pool');
        pool.push(group);
        save.call(this, 'pool', pool);
    }

    /**
     * Unregisters a group from the pool.
     * @public
     */
    unregister (group) {
        let pool = fetch.call(this, 'pool');
        let idx = pool.indexOf(group);
        if (idx !== -1) {
            pool.splice(idx, 1);
        }
        save.call(this, 'pool', pool);
    }

    /**
     * Description.
     * @public
     */
    sortBy (sorter, reverse) {
        let pool = fetch.call(this, 'pool');
        pool.sort(Helpers.sortBy.bind({
            sorter: sorter,
            reverse: reverse
        }));
        save.call(this, 'pool', pool);
    }

    /**
     * Description.
     * @public
     */
    fetchByIndex (idx) {
        return fetch.call(this, 'pool')[idx];
    }

    destroy () {
        this.disposables.dispose();
    }
}

module.exports = Groups;
