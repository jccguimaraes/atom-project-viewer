'use strict';

const _project = require('./project');
const _helpers = require('./helpers');
const _native = require('./native');
const _local = require('./local');

const gateway = {
    project: _project,
    helpers: _helpers,
    native: _native,
    local: _local
};

module.exports = gateway;
