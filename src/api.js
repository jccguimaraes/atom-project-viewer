const model = require('./model');
const groupComponent = require('./group-view');
const projectComponent = require('./project-view');
const editorComponent = require('./editor-view');

const groupModel = function _groupModel (candidate) {
  return model.createGroup(candidate);
};

const groupView = function _groupView (model) {
  return groupComponent.createView(model);
};

const projectModel = function _projectModel (candidate) {
  return model.createProject(candidate);
};

const projectView = function _projectView (model) {
  return projectComponent.createView(model);
};

const editorView = function _editorView () {
  return editorComponent.createView();
};

const group = {
  createModel: groupModel,
  createView: groupView
};

const project = {
  createModel: projectModel,
  createView: projectView
};

const editor = {
  createView: editorView
};

const api = {
  group,
  project,
  editor
};

module.exports = api;
