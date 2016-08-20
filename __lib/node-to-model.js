'use strict';

/**
 *
 */
const n2Mapping = new WeakMap();

/**
 * getNodeModel - description
 *
 * @param  {type} node description
 * @return {type}      description
 */
function getNodeModel (node) {
    return n2Mapping.get(node);
}

/**
 * linkNodeToModel - description
 *
 * @param  {type} node  description
 * @param  {type} model description
 * @return {type}       description
 */
function linkNodeToModel (node, model) {
    n2Mapping.set(node, model)
}

/**
 *
 */
const nodeToModel = {
    getNodeModel: getNodeModel,
    linkNodeToModel: linkNodeToModel
};

/**
 * 
 */
module.exports = nodeToModel;
