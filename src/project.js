'use strict';

// internal dependencies
const _db = require('./db');

// this is a hack for returning an empty NodeList element
const DUMMY_SELECTOR = 'DUMMY_SELECTOR';

// a constant that acts like a query for fetching DOM elements
// that representing projects
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

function openOnTreeView (project) {
    console.debug(project);
    if (
        !project.hasOwnProperty('projectPaths')
        || !Array.isArray(project.projectPaths)
    ) {
        return;
    }
}

const project = {
    fetchAll: fetchAll,
    fetchAllViews: fetchAllViews,
    fetchModelByView: fetchModelByView,
    fetchAllModels: fetchAllModels,
    openOnTreeView: openOnTreeView
};

module.exports = project;
