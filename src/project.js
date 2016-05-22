'use strict';

// internal dependencies
const _db = require('./db');

// a constant that acts like a query for fetching DOM elements
// that representing projects
const projectQuery = 'li[is="pv-list-item"]';

const project = {
    fetchAllViews: function fetchAllViews () {
        const views = document.querySelectorAll(projectQuery);
        return views;
    },
    fetchModelByView: function fetchModelByView (view) {
        return _db.mapper.get(view);
    },
    fetchAllModels: function fetchAllModels () {
        const projectViews = this.fetchAllViews();
        const projectsArray = Array.apply(null, projectViews);
        return projectsArray.map(this.fetchModelByView);
    }
};

module.exports = project;
