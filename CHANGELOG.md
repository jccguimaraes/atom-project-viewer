# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
- Sort clients, groups and projects by natural position or alphabetically;
- Add Clients, Groups and Projects (context-menu);
- Change DOM id to a more unique identifier (maybe uuid);
- Elevate current `atom.project.getPaths()` to a project;
- Allow sidebar to be on left and right;
- SelectView Component *(from atom-space-pen)* `ctrl-alt-t`;
- Resizable panel (as a pane instead?) *(investigate)*;
- Validate if root path is a git repository and initialize it;
- Clear saved project state (this can get above 1Mb of size);

## [0.3.0] -2016-XX-XX
### Added
- Autohide sidebar component ([issue #]());
- Visually disabled projects that have no paths;
- Save database file into a private *GitHub* gist;
- Convert existing/old database file to the new schema;
- Current project on status bar ([issue #]());
### Changed
- Sidebar component;
- Organize by client and/or group and/or project (3 levels) ([issue #]());
- Toggle PV state `ctrl-alt-v`;
- Add Clients, Groups and Projects (menu and context-menu);
- Remove Clients, Groups and Projects (menu and context-menu);
- Edit Clients, Groups and Projects (context-menu only);
- Drag & Drop workflow;
### Deprecated
- None;
### Removed
- Groups/Projects Colors;
### Fixed
- Project state (workspace / files, history and tree-view package);
- Project configuration now lives on atom's internal storage folder;
### Security
- None;
