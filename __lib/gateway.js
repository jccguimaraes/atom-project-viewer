'use strict';

const _helpers = require('./helpers');
const _native = require('./native');
const _local = require('./local');
const _states = require('./states');

const gateway = {
    helpers: _helpers,
    native: _native,
    local: _local,
    states: _states
};

module.exports = gateway;
