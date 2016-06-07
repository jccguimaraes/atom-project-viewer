# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
- Sort clients, groups and projects by natural position or alphabetically ([#21](https://github.com/jccguimaraes/atom-project-viewer/issues/21));
- Elevate current `atom.project.getPaths()` to a project ([#26](https://github.com/jccguimaraes/atom-project-viewer/issues/26));
- Resizable panel (as a pane instead?) *(investigate)* ([#37](https://github.com/jccguimaraes/atom-project-viewer/issues/37));
- Validate if root path is a git repository and initialize it;
- Clear saved project state (this can get above 1Mb of size);
- Clear status bar if project is deleted;
- Keybindings for cycling between projects ([#22](https://github.com/jccguimaraes/atom-project-viewer/issues/22));

## [0.3.0] -2016-XX-XX
### Added
- SelectView Component *(from atom-space-pen)* `ctrl-alt-t`;
- Autohide sidebar component ([#27](https://github.com/jccguimaraes/atom-project-viewer/issues/27));
- Visually disabled projects that have no paths;
- Save database file into a private *GitHub* gist;
- Convert existing/old database file to the new schema;
- Current project on status bar ([#22](https://github.com/jccguimaraes/atom-project-viewer/issues/22));
- Added devicons to enhace icons ([#41](https://github.com/jccguimaraes/atom-project-viewer/issues/41));
### Changed
- Sidebar component;
- Organize by client and/or group and/or project (3 levels) ([#25](https://github.com/jccguimaraes/atom-project-viewer/issues/25));
- Toggle PV state `ctrl-alt-v`;
- Add Clients, Groups and Projects (menu and context-menu);
- Remove Clients, Groups and Projects (menu and context-menu);
- Update Clients, Groups and Projects (context-menu only);
- Drag & Drop workflow;
### Deprecated
- None;
### Removed
- Groups/Projects Colors;
- Update Clients, Groups and Projects from menu;
- Update database folder (you can now backup as a private *Gist*);
### Fixed
- Project state (workspace / files, history and tree-view package);
- Project configuration now lives on atom's internal storage folder;
### Security
- None;
