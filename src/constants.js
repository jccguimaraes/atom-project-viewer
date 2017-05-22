const constants = Object.create(null);

constants.packageName = 'project-viewer';

// this makes constants immutable
Object.freeze(constants);

/**
 * Package common constants
 * @module constants
 */
module.exports = constants;
