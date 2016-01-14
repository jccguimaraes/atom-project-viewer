## 0.2.28
* closes issue #19

## 0.2.27
* first attempt to close issue #19

## 0.2.26
* Feature implemented: drag&drop projects from one group to another (thanks to @canastro)
* fixed issue #17 - removed some leftovers
* fixed issue #11 - improved states reference and also a bug when multiple paths existed
* fixed a typo on config

## 0.2.25
* hopefully closes issue #16 and #12 (although this changing colors will probably not work on windows until a permanent solution)

## 0.2.24
* hanging group name would not reflex on the child projects

## 0.2.23
* Fixing a typo

## 0.2.22
* Fixing other issues

## 0.2.21
* Fixing issue #12 when a query for the stylesheet did not return an actual stylesheet object

## 0.2.20
* Added previous changelog and fixed README tables

## 0.2.19
* Bug fix related to buffers paths and a string in the constants

## 0.2.18
* Bug fix related to buffers

## 0.2.17
* Bug fixes

## 0.2.16
* Bug fixes

## 0.2.15
* Bug fixes

## 0.2.14
* Bug fixes

## 0.2.13
* Edit groups and projects.
* Coloring groups and projects (check settings for extra configuration).
* Project folders state are now saved (check settings for extra configuration).
* Changed the json file properties (will not affect the previous file - I hope...).

## 0.2.12
* Adding groups and projects got more sanitized.
* If the name of group/project exists, it will not be created (Ability to add projects with same name in different groups).

## 0.2.11
* (Ongoing/continuing) fixing huge issues that have been created from the previous updates.
* Fixed abrupt close of files that were not saved when changing projects (solution is a patch for now).

## 0.2.10
* (Ongoing/continuing) fixing huge issues that have been created from the previous updates.
* Fixed issue when checking active project. [Issue #6](https://github.com/jccguimaraes/atom-project-viewer/issues/6).

## 0.2.9
* (Ongoing/continuing) fixing huge issues that have been created from the previous updates.

## 0.2.8
* (Ongoing) fixing huge issues that have been created from the previous updates.

## 0.2.7
* Removed some experimental trash.
* Officially closed [Issue #4](https://github.com/jccguimaraes/atom-project-viewer/issues/4).

## 0.2.6
* Something wrong with the apm (crashed on publish).

## 0.2.5
* Saving copllapsed/expanded state for groups as well as fixed refreshing of all groups/projects after add/remove/edit groups/projects [Issue #4](https://github.com/jccguimaraes/atom-project-viewer/issues/4).

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
