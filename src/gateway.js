'use strict';

const project = require('./project');
const helpers = require('./helpers');

const gateway = {
    project: project,
    helpers: helpers
};

module.exports = gateway;
