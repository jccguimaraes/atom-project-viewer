'use strict';

// Internal dependencies
const _db = require('./db');

// This is a hack for returning an empty NodeList element
const DUMMY_SELECTOR = 'DUMMY_SELECTOR';

// A constant that acts like a query for fetching DOM elements
// that represent projects
const PROJECTS_LIST_QUERY = 'li[is="pv-list-item"]';

function fetchAllViews (rootView) {
    if (!rootView) {
        return document.querySelectorAll(DUMMY_SELECTOR);
    }
    return rootView.querySelectorAll(PROJECTS_LIST_QUERY);
}

function fetchModelByView (view) {
    return _db.mapper.get(view);
}

function fetchAllModels (rootView) {
    return Array.apply(null, fetchAllViews(rootView))
        .map(fetchModelByView);
}

function fetchAll () {
    return _db.views.projects.map(
        (projectId) => {
            return _db.mapper.get(
                document.getElementById(projectId)
            );
        }
    ).filter(
        (project) => {
            if (!project) {
                return false;
            }
            return true;
        }
    );
}

function openOnTreeView (project) {}

const project = {
    fetchAll: fetchAll,
    fetchAllViews: fetchAllViews,
    fetchModelByView: fetchModelByView,
    fetchAllModels: fetchAllModels,
    openOnTreeView: openOnTreeView
};

module.exports = project;
