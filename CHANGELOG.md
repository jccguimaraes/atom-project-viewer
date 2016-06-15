# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

- Add bulk operation on project creation ([#50](https://github.com/jccguimaraes/atom-project-viewer/issues/50));
- Reimplement colors ([#49](https://github.com/jccguimaraes/atom-project-viewer/issues/49));
- Sort clients, groups and projects by natural position or alphabetically ([#21](https://github.com/jccguimaraes/atom-project-viewer/issues/21));
- Elevate current `atom.project.getPaths()` to a project ([#26](https://github.com/jccguimaraes/atom-project-viewer/issues/26));
- Resizable panel (as a pane instead?) *(investigate)* ([#37](https://github.com/jccguimaraes/atom-project-viewer/issues/37));
- Validate if root path is a git repository and initialize it;
- Clear saved project state (this can get above 1Mb of size);
- Keybindings for cycling between projects ([#22](https://github.com/jccguimaraes/atom-project-viewer/issues/22));

## [0.3.6] - 2016-07-14

### Added

- Added a context-menu entry to open a project in a new window if `alwaysOpenInNewWindow` is enabled and the other way round ([#46](https://github.com/jccguimaraes/atom-project-viewer/issues/46#issuecomment-225396861));

### Changed

- Grammar and spelling fixes ([#54](https://github.com/jccguimaraes/atom-project-viewer/pull/54));

## [0.3.5] - 2016-07-14

### Added

- When using a package like `tool-bar`, there were conflicts with the icons classes ([#51](https://github.com/jccguimaraes/atom-project-viewer/pull/51));

### Fixed

- addIcons() now pre-seeds changesToItem if the item has an icon ([#53](https://github.com/jccguimaraes/atom-project-viewer/pull/53/)) ([#52](https://github.com/jccguimaraes/atom-project-viewer/issues/52));
- When `alwaysOpenInNewWindow` was enabled, it would also open in the same window ([#46](https://github.com/jccguimaraes/atom-project-viewer/issues/46#issuecomment-225468789));
- Added @DamnedScholar to contributors list;
- This file structure;

## [0.3.4] - 2016-07-13

### Added

- Options information in the README file

### Fixed

- New projects are gone after restart ([#47](https://github.com/jccguimaraes/atom-project-viewer/issues/47));

### Changed

- Due to some key-bindings conflict between packages, have decided to change the project own key-bindings. ([#46](https://github.com/jccguimaraes/atom-project-viewer/issues/46));

## [0.3.3] - 2016-07-11

### Fixed

- Fixed bad workflow on updating Clients/Groups/Projects ([#48](https://github.com/jccguimaraes/atom-project-viewer/issues/48));

### Added

- Possibility (through config option) to always open projects in a new window (default Atom\'s behavior), instead of opening in the same window. ([#46](https://github.com/jccguimaraes/atom-project-viewer/issues/46));

## [0.3.2] - 2016-07-08

### Fixed

- Fixed `SelectView` when no projects were available ([#45](https://github.com/jccguimaraes/atom-project-viewer/issues/45));

## [0.3.1] - 2016-07-08

### Changed

- Moved `atom-space-pen-views` from `devDependencies` to `dependencies` available ([#45](https://github.com/jccguimaraes/atom-project-viewer/issues/45));

## [0.3.0] - 2016-07-08

### Added

- SelectView Component *(from atom-space-pen)* `ctrl-alt-t`;
- Autohide sidebar component ([#27](https://github.com/jccguimaraes/atom-project-viewer/issues/27));
- Visually disabled projects that have no paths;
- Save database file into a private *GitHub* gist;
- Convert existing/old database file to the new schema;
- Current project on status bar ([#22](https://github.com/jccguimaraes/atom-project-viewer/issues/22));
- Added `devicons` to enhance icons ([#41](https://github.com/jccguimaraes/atom-project-viewer/issues/41));

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
