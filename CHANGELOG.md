# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).


## [1.3.0] - 2018-02-03

### Fixed

- Issues ([#187](https://github.com/jccguimaraes/atom-project-viewer/issues/187)), ([#186](https://github.com/jccguimaraes/atom-project-viewer/issues/186)), ([#182](https://github.com/jccguimaraes/atom-project-viewer/issues/182)), ([#166](https://github.com/jccguimaraes/atom-project-viewer/issues/166)).

## [1.2.5] - 2017-11-09

### Fixed

- Reverted ([#177](https://github.com/jccguimaraes/atom-project-viewer/pull/177)).

## [1.2.4] - 2017-10-28

### Fixed

- Fix issue regarding ([#177](https://github.com/jccguimaraes/atom-project-viewer/pull/177)).

## [1.2.3] - 2017-10-28

### Added

- Add @bobtherobot as a contributor
- UX enhancements in `editor` mode ([#177](https://github.com/jccguimaraes/atom-project-viewer/pull/177)).

## [1.2.2] - 2017-10-10

### Fixed

- Open in a new window not working ([#169](https://github.com/jccguimaraes/atom-project-viewer/issues/169)) and ([#170](https://github.com/jccguimaraes/atom-project-viewer/issues/170))

### Added

- `keepWindowSize` feature. Thanks to @audrummer15 ([#172](https://github.com/jccguimaraes/atom-project-viewer/pull/172)).

## [1.2.1] - 2017-10-02

### Added

- Dock version (experimental) thanks to @rgawenda ([#159](https://github.com/jccguimaraes/atom-project-viewer/issues/159)) and ([#160](https://github.com/jccguimaraes/atom-project-viewer/pull/160)).

### Fixed

- Devicons not showing thanks to @mdeuerlein ([#135](https://github.com/jccguimaraes/atom-project-viewer/issues/135)) and ([#168](https://github.com/jccguimaraes/atom-project-viewer/pull/168))
- `Elevate to Project...` due to `tree-view` changes;
- Missing `sortBy` option on editing `groups`.
- Not actually a fix, but disabled (for the time being) switching between opened projects in different instances of Atom.

## [1.2.0] - 2017-06-25

### Added

- Error when creating a node without selecting a node type ([#140](https://github.com/jccguimaraes/atom-project-viewer/issues/140));
- Keyboard navigation not possible in new project/group creator ([#136](https://github.com/jccguimaraes/atom-project-viewer/issues/136)).

### Changed

- Refactor SelectView to use new `atom-select-list` ([#144](https://github.com/jccguimaraes/atom-project-viewer/issues/144)).

### Fixed

- Open in new window doesn't work on first attempt ([#157](https://github.com/jccguimaraes/atom-project-viewer/issues/157));
- Cannot set property 'treeView' of undefined ([#152](https://github.com/jccguimaraes/atom-project-viewer/issues/152)) with PR ([#156](https://github.com/jccguimaraes/atom-project-viewer/pull/156)).

## [1.1.2] - 2017-05-22

### Fixed

- Bad workflow for status-bar issues ([#149](https://github.com/jccguimaraes/atom-project-viewer/issues/149)).

## [1.1.1] - 2017-05-22

### Fixed

- Attempt to fix status-bar issues ([#149](https://github.com/jccguimaraes/atom-project-viewer/issues/149)).

## [1.1.0] - 2017-05-22

### Added

- Config option to list packages that need to be reloaded on project switch([#133](https://github.com/jccguimaraes/atom-project-viewer/issues/133));
- @erikgeiser as a contributor (a big thank you!);
- Custom hot zone width ([#150](https://github.com/jccguimaraes/atom-project-viewer/pull/150)) and ([#131](https://github.com/jccguimaraes/atom-project-viewer/issues/131));
- Dock or Panel container (Panel by default). (***highly unstable***)

### Fixed

- Fix context switch ([#113](https://github.com/jccguimaraes/atom-project-viewer/issues/113)), ([#126](https://github.com/jccguimaraes/atom-project-viewer/issues/126)) and ([#148](https://github.com/jccguimaraes/atom-project-viewer/issues/148));
- Attempt to fix some packages that need to also restart / reset on project switching;
- Opening of editorView in the center.

### Removed

- Import / Export to Google Drive option in menu as it's useless.

## [1.0.14] - 2017-05-01

### Fixed

- Hacky solution for beta channel (`1.17`) ([#113](https://github.com/jccguimaraes/atom-project-viewer/issues/113));

## [1.0.13] - 2017-04-21

### Fixed

- Cannot read property 'createView' of null ([#142](https://github.com/jccguimaraes/atom-project-viewer/issues/142));
- Fix bug on searching icons with non alphanumeric characters ([#139](https://github.com/jccguimaraes/atom-project-viewer/issues/139));
- Fix bug when migrating from a previous version (even if local file didn't exist) ([#138](https://github.com/jccguimaraes/atom-project-viewer/issues/138));
- How to open last open project/file on restart ([#108](https://github.com/jccguimaraes/atom-project-viewer/issues/108));

### Added

- @GreenGremlin and @stephen-last as a contributor (a big thank you!);
- Fix typo on Issue template ([#141](https://github.com/jccguimaraes/atom-project-viewer/pull/141));
- If a project is already open, switch to it rather than open a second instance ([#112](https://github.com/jccguimaraes/atom-project-viewer/issues/112));

## [1.0.12] - 2017-03-19

### Fixed

- Fix an issue related with the `Tree-View` ([#134](https://github.com/jccguimaraes/atom-project-viewer/issues/134));

## [1.0.11] - 2017-03-19

### Fixed

- New linter version broke the hack, so I removed it ([#134](https://github.com/jccguimaraes/atom-project-viewer/issues/134));

## [1.0.10] - 2017-03-17

### Fixed

- Remove project color ([#132](https://github.com/jccguimaraes/atom-project-viewer/issues/132));
- Focus panel workflow improved [#130](https://github.com/jccguimaraes/atom-project-viewer/issues/130));
- `Tree-View`'s folder structure and position [#126](https://github.com/jccguimaraes/atom-project-viewer/issues/126)).

### Added

- Auto hide panel configuration option to show as absolute ([#131](https://github.com/jccguimaraes/atom-project-viewer/issues/131)).

## [1.0.9] - 2017-02-17

### Fixed

- Config issue on disclaimer.

### Added

- Added @zhudock and @CKLFP as contributors.

### Updated

- CHANGE LOG and README files.

## [1.0.8] - 2017-02-17

### Fixed

- Issues in `editor`.

## [1.0.7] - 2017-02-17

### Added

- Context menu for delete and create `group` or `project` (missed feature from `0.3.x`).
- Open local paths (macOS's `finder` / Windows' `explorer` and Linux's `file manager`).

### Fixed

- *Gist* importing from an old database now passes through the migration step.

## [1.0.6] - 2017-02-15

### Added

- Add @girlandhercode and @colorful-tones as a contributors.
- Disclaimer for Release notes.

### Fixed

- Fix Elevate to project ([#121](https://github.com/jccguimaraes/atom-project-viewer/issues/121)).
- Fix autohide ([#120](https://github.com/jccguimaraes/atom-project-viewer/issues/120)) and ([#119](https://github.com/jccguimaraes/atom-project-viewer/issues/119)).
- Fix custom width changes not taking place.

### Updated

- README and CHANGE LOG.

## [1.0.5] - 2017-02-14

### Fixed

- Project Viewer Focus Panel identified ([here](https://github.com/jccguimaraes/atom-project-viewer/issues/119#issuecomment-279496984))

## [1.0.4] - 2017-02-13

### Fixed

- Panel visibility issues ([#118](https://github.com/jccguimaraes/atom-project-viewer/issues/118))
- Auto hide does not unhide on mouse-over ([#117](https://github.com/jccguimaraes/atom-project-viewer/issues/117))

## [1.0.3] - 2017-02-13

### Fixed

- Fixed typo that broke everything :scream:

## [1.0.2] - 2017-02-13

### Added

- Information about migrating from previous version.

## [1.0.1] - 2017-02-13

### Fixed

- Fix migration of database.

## [1.0.0] - 2017-02-13

- Look at the README's [features](https://atom.io/packages/project-viewer#features).

## [0.3.43] - 2017-01-22

### Fixed

- Fixed getter of input model ([#110](https://github.com/jccguimaraes/atom-project-viewer/issues/110))

## [0.3.42] - 2016-12-21

### Fixed

- Project config being corrupted ([#106](https://github.com/jccguimaraes/atom-project-viewer/issues/106))

## [0.3.41] - 2016-12-21

### Fixed

- Fix `Add project folder` validation issues ([#105](https://github.com/jccguimaraes/atom-project-viewer/issues/105))

## [0.3.40] - 2016-12-21

### Added

- Custom title color ([#101](https://github.com/jccguimaraes/atom-project-viewer/issues/101))

### Fixed

- Root paths should be left justified in the project dialog ([#104](https://github.com/jccguimaraes/atom-project-viewer/issues/104))
- Project paths added to an open project are lost after closing and reopening the project ([#103](https://github.com/jccguimaraes/atom-project-viewer/issues/103))

### Changed

- Updated README

## [0.3.39] - 2016-12-07

### Fixed

- Filtering icons

### Added

- Doubled the size of the icons when `onlyIcons` is set to true;
- Custom hover color ([#101](https://github.com/jccguimaraes/atom-project-viewer/issues/101))

## [0.3.38] - 2016-12-07

### Fixed

- Issues on icons (on create and update)

## [0.3.37] - 2016-12-07

### Added

- FEATURE: Icons list ([#66](https://github.com/jccguimaraes/atom-project-viewer/issues/66))

## [0.3.36] - 2016-12-07

### Added

- FEATURE: Custom selected color ([#101](https://github.com/jccguimaraes/atom-project-viewer/issues/101))

## [0.3.35] - 2016-12-07

### Fixed

- Colors lost when updating project settings ([#100](https://github.com/jccguimaraes/atom-project-viewer/issues/100))

### Added

- Add `paypal` badge.

## [0.3.34] - 2016-12-05

### Added

- Add `beerpay` badge.

## [0.3.33] - 2016-12-04

### Added

- FEATURE: Resizable panel ([#37](https://github.com/jccguimaraes/atom-project-viewer/issues/37))

## [0.3.32] - 2016-12-01

### Fixed

- Added new contributor [Kristian Barrese](https://github.com/bitkris-dev)
- Fix for horizontal scrollbar ([#99](https://github.com/jccguimaraes/atom-project-viewer/pull/99))

## [0.3.31] - 2016-11-29

### Fixed

- Problems with publish

## [0.3.30] - 2016-11-29

### Added

- Refacto - Select-view: use native functionnalities of atom-space-pen-views plugin ([#98](https://github.com/jccguimaraes/atom-project-viewer/pull/98))

### Fixed

- FEATURE: Add fuzzy project search ([#89](https://github.com/jccguimaraes/atom-project-viewer/issues/89))

## [0.3.29] - 2016-11-19

### Fixed

- Added new contributor @lneveu.
- Add - Select-view: fuzzy searching and fix second line class name ([#97](https://github.com/jccguimaraes/atom-project-viewer/pull/97))
- FEATURE: Add fuzzy project search ([#89](https://github.com/jccguimaraes/atom-project-viewer/issues/89))

## [0.3.28] - 2016-11-18

### Fixed

- ISSUE: Project Swap on Atom Search ([#95](https://github.com/jccguimaraes/atom-project-viewer/issues/95))

## [0.3.27] - 2016-11-12

### Changed

- Updated README file.

## [0.3.26] - 2016-11-12

### Fixed

- ISSUE: shortcuts are not working using Windows ([#94](https://github.com/jccguimaraes/atom-project-viewer/issues/94))
- Fix: Missing DEV Icons ([#93](https://github.com/jccguimaraes/atom-project-viewer/issues/93))
- Bug: Can't remove project from client or group via the update modal ([#75](https://github.com/jccguimaraes/atom-project-viewer/issues/75))

### Added

- FEATURE: Clear project search after selection ([#90](https://github.com/jccguimaraes/atom-project-viewer/issues/90))
- ISSUE: Close my openned files when I switch the "context" ([#76](https://github.com/jccguimaraes/atom-project-viewer/issues/76))

## [0.3.25] - 2016-10-07

### Fixed

- ISSUE: Create project modal can't click create button if window height is not enough ([#85](https://github.com/jccguimaraes/atom-project-viewer/issues/85))

## [0.3.24] - 2016-09-27

### Removed

- FEATURE: Open project in dev mode ([#77](https://github.com/jccguimaraes/atom-project-viewer/issues/77));
  - For this reason check ([#87](https://github.com/jccguimaraes/atom-project-viewer/issues/87))

## [0.3.23] - 2016-09-06

### Fixed

- Sidebar status is not remembered upon atom restart ([#83](https://github.com/jccguimaraes/atom-project-viewer/issues/83));

## [0.3.22] - 2016-09-05

### Fixed

- Sidebar status is not remembered upon atom restart ([#83](https://github.com/jccguimaraes/atom-project-viewer/issues/83));

## [0.3.21] - 2016-08-27

### Fixed

- An issue with devMode on `Item - Create`.

## [0.3.20] - 2016-08-24

### Added

- FEATURE: Open project in dev mode ([#77](https://github.com/jccguimaraes/atom-project-viewer/issues/77));

## [0.3.19] - 2016-08-14

### Changed

- Multi working sets implemented ([#78](https://github.com/jccguimaraes/atom-project-viewer/pull/78));
- Changed Travis CI and AppVeyor files;

### Added

- Added CircleCI;

## [0.3.18] - 2016-08-05

### Fixed

- Elevate to project would not check for the name;

## [0.3.17] - 2016-08-05

### Fixed

- Add root path in windows does not trim path as name([#78](https://github.com/jccguimaraes/atom-project-viewer/issues/78));

## [0.3.16] - 2016-08-01

### Fixed

- After updating to 1.9.0 some errors occur when changing between projects (this is a workaround for now);
- Fixed selected / active project highlighted color;
- Fixed AppVeyor link.

## [0.3.15] - 2016-07-17

### Added

- Adding live filter feature for icons ([#70](https://github.com/jccguimaraes/atom-project-viewer/pull/70));

### Fixed

- Fix pathNotInArray ([#72](https://github.com/jccguimaraes/atom-project-viewer/pull/72)), ([#71](https://github.com/jccguimaraes/atom-project-viewer/issues/71));
- Cannot read property 'addNode' of null ([#69](https://github.com/jccguimaraes/atom-project-viewer/issues/69));
- Cannot read property 'visible' of undefined ([#68](https://github.com/jccguimaraes/atom-project-viewer/issues/68));

## [0.3.14] - 2016-07-11

### Fixed

- Does not open left-aligned on first load ([#67](https://github.com/jccguimaraes/atom-project-viewer/issues/67));
- Possible icon redundancy ([#65](https://github.com/jccguimaraes/atom-project-viewer/pull/65));

## [0.3.13] - 2016-07-04

### Fixed

- Uncaught TypeError: Cannot read property 'groups' of undefined ([#62](https://github.com/jccguimaraes/atom-project-viewer/issues/62))

### Added

- Possible icon redundancy ([#63](https://github.com/jccguimaraes/atom-project-viewer/issues/63)) ([#64](https://github.com/jccguimaraes/atom-project-viewer/pull/64));

## [0.3.12] - 2016-06-28

### Added

- Reimplement colors ([#49](https://github.com/jccguimaraes/atom-project-viewer/issues/49));
- Button to add the current tree view paths ([#59](https://github.com/jccguimaraes/atom-project-viewer/pull/59));
- Sort clients, groups and projects by natural position or alphabetically ([#21](https://github.com/jccguimaraes/atom-project-viewer/issues/21));

### Fixed

- Removing a project path when updating behaves weirdly ([#60](https://github.com/jccguimaraes/atom-project-viewer/issues/60));

## [0.3.11] - 2016-06-18

### Added

- Added Travis CI and AppVeyor badges;

### Fixed

- The backup saves once. Any other changes are not saved ([#58](https://github.com/jccguimaraes/atom-project-viewer/issues/58));

## [0.3.10] - 2016-06-17

### Added

- Elevate current `tree-view` opened folders to project ([#26](https://github.com/jccguimaraes/atom-project-viewer/issues/26));
- Forcing all icons at font-size: `@component-icon-size` extension to `SelectView` ([#56](https://github.com/jccguimaraes/atom-project-viewer/pull/56));

## [0.3.9] - 2016-06-16

### Fixed

- Forcing all icons at font-size: `@component-icon-size` ([#56](https://github.com/jccguimaraes/atom-project-viewer/pull/56));

## [0.3.8] - 2016-06-15

### Fixed

- Project status does not update on adding/removing paths ([#55](https://github.com/jccguimaraes/atom-project-viewer/issues/55));

## [0.3.7] - 2016-06-15

### Fixed

- Added extra validation in the context-menu for opening a project in a new/same window.

## [0.3.6] - 2016-06-15

### Added

- Added a context-menu entry to open a project in a new window if `alwaysOpenInNewWindow` is enabled and the other way round ([#46](https://github.com/jccguimaraes/atom-project-viewer/issues/46#issuecomment-225396861));

### Changed

- Grammar and spelling fixes ([#54](https://github.com/jccguimaraes/atom-project-viewer/pull/54));

## [0.3.5] - 2016-06-14

### Added

- When using a package like `tool-bar`, there were conflicts with the icons classes ([#51](https://github.com/jccguimaraes/atom-project-viewer/pull/51));

### Fixed

- addIcons() now pre-seeds changesToItem if the item has an icon ([#53](https://github.com/jccguimaraes/atom-project-viewer/pull/53/)) ([#52](https://github.com/jccguimaraes/atom-project-viewer/issues/52));
- When `alwaysOpenInNewWindow` was enabled, it would also open in the same window ([#46](https://github.com/jccguimaraes/atom-project-viewer/issues/46#issuecomment-225468789));
- Added @DamnedScholar to contributors list;
- This file structure;

## [0.3.4] - 2016-06-13

### Added

- Options information in the README file

### Fixed

- New projects are gone after restart ([#47](https://github.com/jccguimaraes/atom-project-viewer/issues/47));

### Changed

- Due to some key-bindings conflict between packages, have decided to change the project own key-bindings. ([#46](https://github.com/jccguimaraes/atom-project-viewer/issues/46));

## [0.3.3] - 2016-06-11

### Fixed

- Fixed bad workflow on updating Clients/Groups/Projects ([#48](https://github.com/jccguimaraes/atom-project-viewer/issues/48));

### Added

- Possibility (through config option) to always open projects in a new window (default Atom\'s behavior), instead of opening in the same window. ([#46](https://github.com/jccguimaraes/atom-project-viewer/issues/46));

## [0.3.2] - 2016-06-08

### Fixed

- Fixed `SelectView` when no projects were available ([#45](https://github.com/jccguimaraes/atom-project-viewer/issues/45));

## [0.3.1] - 2016-06-08

### Changed

- Moved `atom-space-pen-views` from `devDependencies` to `dependencies` available ([#45](https://github.com/jccguimaraes/atom-project-viewer/issues/45));

## [0.3.0] - 2016-06-08

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
- Update Clients, Groups and Projects (context-menu);
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
