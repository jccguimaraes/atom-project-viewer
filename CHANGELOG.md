## 0.2.4
* When adding a path to a project, if the name is empty, it will populate with the name of the folder of that path. [Issue #3](https://github.com/jccguimaraes/atom-project-viewer/issues/3)
* Fixed remove path workflow.

## 0.2.3
* Added gif for package preview.

## 0.2.2
* Fixed deleting the file after each update. Sorry!!!!!! The file needed to change where it was. So hopefully you will not loose any more of your groups/projects.

## 0.2.1
* Removed a file that was wrongly added.

## 0.2.0
* A message display when no groups exist.
* Improved the context menu on the right panel.
* Small code improvements.
* Buffering files (check settings to enable), may cause some lag on switching projects.
* Improved the file writing workflow. Added as a promise for overlaping savings (was corrupting the projects.json).
* Fixed clicking on the active project would switch to itself again.

## 0.1.6
* Refactored the main project structure.
* UI tweaks on some components to have Atom's style guide.

## 0.1.5
* Added basic UI changes for the selected project

## 0.1.4
* Fixed an issue regarding inputs in the modal, changed to tag atom-text-editor instead of old input.
* small updates on the README file.

## 0.1.3
* Fixed an issue related with the config file.

## 0.1.2 - updated README
* Updated the README file.

## 0.1.1 - updated README
* Updated the README file.

## 0.1.0 - First Release
* Ability to add and remove groups and projects.
* Right panel toggling for viewing your groups and projects.
* Collapsing and Expanding groups.
* Your DB is written in a local package file called projects.json (will think on a better solution in the future).
* All elements follow the Atom's **Styleguide** package guidelines.
