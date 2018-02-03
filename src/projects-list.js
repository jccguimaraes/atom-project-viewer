const ProjectsListView = require('./projects-list-view');
const {getViewFromModel} = require('./common');

class ProjectsList extends ProjectsListView {
  toggle () {
    if (this.panel && this.panel.isVisible()) {
      this.cancel()
    } else {
      this.show()
    }
  }

  createItem (item) {
    const element = document.createElement('li');
    element.className = 'item';
    element.textContent = item.breadcrumb();
    return element;
  }

  update (items) {
    this.setItems(items);
  }

  confirmSelection (item) {
    const view = getViewFromModel(item);
    if (view) {
      view.openOnWorkspace();
    }
    this.cancel();
  }
}

module.exports = ProjectsList;
