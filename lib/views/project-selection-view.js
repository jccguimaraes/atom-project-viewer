'use strict';

class ProjectSelectionView extends HTMLElement {

    // native
    createdCallback () {
        this.classList.add('block');
        this.description = document.createElement('label');
        this.select = document.createElement('select');
        this.select.classList.add('form-control');
        this.appendChild(this.description);
        this.appendChild(this.select);
    }

    attachedCallback () {}

    detachedCallback () {}

    // custom
    setDescription (description) {
        this.description.textContent = description;
    }

    setProjects (projects) {
        if (!projects || !projects.length) {
            return;
        }

        function forEachProject(project) {
            let option;
            option = document.createElement('option');
            option.value = 'option-' + project.name + '-p*g-' + project.group;
            if (project.name) {
                option.setAttribute('data-project', project.group);
            }
            if (project.group) {
                option.textContent = project.name + ' (' + project.group + ')';
            } else {
                option.textContent = project.name;
            }
            this.select.appendChild(option);
        }

        projects.forEach(forEachProject, this);
    }

    getSelectedProject () {
        return this.select.value;
    }

    setDefaultProject (project) {
        if (!project || !project.name) {
            return;
        }
        this.select.value = 'option-' + project.name + '-p*g-' + project.group;
    }
}

module.exports = document.registerElement(
    'project-selection-view',
    {
        prototype: ProjectSelectionView.prototype,
        extends: 'div'
    }
);
