'use strict';

const DB = require('./helpers/database');

class GroupSelection {
    constructor (model) {
        this.model = model;
    }

    setDescription (description) {
        this.description = description;
    }

    getDescription () {
        return this.description;
    }

    setOptions () {
        return DB.data.groups;
    }
}

module.exports = GroupSelection;
