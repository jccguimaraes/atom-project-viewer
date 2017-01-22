# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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

- Custom title color regarding ([#101](https://github.com/jccguimaraes/atom-project-viewer/issues/101))

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
- Custom hover color regarding ([#101](https://github.com/jccguimaraes/atom-project-viewer/issues/101))

## [0.3.38] - 2016-12-07

### Fixed

- Issues regarding icons (on create and update)

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

### Added

- Added new contributor [Loann Neveu](https://github.com/lneveu)
- Add - Select-view: fuzzy searching and fix second line class name ([#97](https://github.com/jccguimaraes/atom-project-viewer/pull/97))

### Fixed

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

- Multiple working sets implemented ([#78](https://github.com/jccguimaraes/atom-project-viewer/pull/78));
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

- The backup only saves once. Any other changes are not saved ([#58](https://github.com/jccguimaraes/atom-project-viewer/issues/58));

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
