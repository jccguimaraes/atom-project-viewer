# README

[![Join the chat at https://gitter.im/jccguimaraes/atom-project-viewer](http://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg?style=flat-square)](https://gitter.im/jccguimaraes/atom-project-viewer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors)

[![atom version](https://img.shields.io/badge/atom-1.12.7-orange.svg?style=flat-square)](https://atom.io/packages/project-viewer/)
[![apm version](https://img.shields.io/apm/v/project-viewer.svg?style=flat-square)](https://atom.io/packages/project-viewer/)
[![apm downloads](https://img.shields.io/apm/dm/project-viewer.svg?style=flat-square)](https://atom.io/packages/project-viewer/)

[![Travis CI CI](https://travis-ci.org/jccguimaraes/atom-project-viewer.svg?branch=master)](https://travis-ci.org/jccguimaraes/atom-project-viewer)
[![AppVeyor CI](https://ci.appveyor.com/api/projects/status/2t91cemmpf635p2e?svg=true
)](https://ci.appveyor.com/project/jccguimaraes/atom-project-viewer)
[![CircleCI CI](https://circleci.com/gh/jccguimaraes/atom-project-viewer/tree/master.svg?style=shield&circle-token=c2215983920e08d193a80b5775760792c5d2e883
)](https://circleci.com/gh/jccguimaraes/atom-project-viewer)

[![Beerpay](https://beerpay.io/jccguimaraes/atom-project-viewer/badge.svg?style=flat-square)](https://beerpay.io/jccguimaraes/atom-project-viewer)
[![paypal](https://img.shields.io/badge/paypal-donate-blue.svg?style=flat-square)](https://paypal.me/jccguimaraes)

## Table Of Contents

* [Introduction](#introduction)
* [Installation](#installation)
* [Features](#features)
* [Shortcuts](#shortcuts)
* [Settings](#settings)
* [Local File manipulation](#local-file-manipulation)
  * [Group Schema](#group-schema)
  * [Project Schema](#project-schema)
* [Contributors](#contributors)
* [Contacts](#contacts)
* [A Special Thank You!](#a-special-thank-you)

## Introduction

This is a package built for and by the Atom community. For contribution read [below](#contributors).

## Installation

In a terminal / command line write the following line `apm install project-viewer`.

Or simply find the package by accessing the menu **Atom → Preferences... → Install** and search for ***project-viewer***.

## Features

- Group nesting;
  - > Infinite nesting of `groups` which can contain also `projects`;
  - > `projects` can be at any level.
- Sidebar Left / Right (first or last) position;
- Auto hide sidebar with hover behavior;
- Resizable panel;
  - > *Double click* to default width;
- Hide header for more space;
  - > This is available through a config option, default is *not autohide*.
- Focus toggle;
  - > Toggling focus will switch between current active element and the panel.
- `SelectListView` integration;
  - > Only shows `projects`.
- Traverse and select `projects` with `up` and `down` keys;
- Toggle collapse / expand of `groups` with `left` and `right` keys;
- `status-bar` with the `project`'s' *breadcrumb* path;
- Open the local database file for direct editing;
- Old database schemas conversion tools;
- Editor for `groups` / `projects` creation and update;
  - Create, update and remove `group` or `project`;
  - Automatic set it's name according to first path base name added;
  - Bulk operation on a `project` creation;
    - > Ability to create individual `projects` when more than one path is provided;
    - > Each project will automatically have it's name set to it's path base name.
  - Filtering icons;
  - List of icons in editor as *only icons* or *icon and description*;
    - > This is available through a config option, default is *icon and description*.
- No `groups` and / or `projects` message;

## Shortcuts

- `shift-ctrl-alt-c` toggles sidebar autohide;
- `shift-ctrl-alt-v` toggles sidebar visibility;
- `shift-ctrl-alt-n` open the editor tab;
- `shift-ctrl-alt-m` toggle focus from active panel and the sidebar;
- `shift-ctrl-alt-l` toggle the select list modal;

## Settings

Settings | Type | Description | Default
---------|------|-------------|--------
`visibilityOption` | `String` | Define what would be the default action for **project-viewer** visibility on startup. | `Display on startup`
`visibilityActive` | `Boolean` | Relative to the interaction option selected above. | `true`
`panelPosition` | `String` | Position the panel to the left or right of the main pane. | `Right`
`autoHide` | `Boolean` | Panel has auto hide with hover behavior. | `false`
`hideHeader` | `Boolean` | You can have more space for the list by hiding the header. | `false`
`keepContext` | `Boolean` | When switching from items, if set to `true`, will keep current context. Also will not save contexts between switching. | `false`
`openNewWindow` | `Boolean` | Always open items in a new window. | `false`
`statusBar` | `Boolean` | Will show the breadcrumb to the current opened project in the `status-bar`. | `false`
`customWidth` | `Integer` | Define a custom width for the panel.<br>*double clicking* on the resizer will reset the width | 200
`onlyIcons` | `Boolean` | Will show only the icons in the icon\'s list | `true`
`customPalette` | `String` | Custom palette to use on editor | `#F1E4E8, #F7B05B, #595959, #CD5334, #EDB88B, #23282E, #263655, #F75468, #FF808F, #FFDB80, #292E1E, #248232, #2BA84A, #D8DAD3, #FCFFFC, #8EA604, #F5BB00, #EC9F05, #FF5722, #BF3100`
`rootSortBy` | `Array` | Sets the root sort by. | `position`

> Keep in mind that this package uses Atom's Storage to save all groups and projects. It is wise to save it to the cloud (ex: you can import and export a private Gist through this package!).

## Local File manipulation

### Group Schema

parameter | Type | Description | Required
----------|------|-------------|--------
`type` | `String` | | `true`
`name` | `String` | | `true`
`list` | `Array` | | `true`

### Project Schema

parameter | Type | Description | Required
----------|------|-------------|--------
`type` | `String` | | `true`

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/14871650?v=3" width="100px;"/><br /><sub>João Guimarães</sub>](https://github.com/jccguimaraes)<br />💬 [🐛](https://github.com/jccguimaraes/atom-project-viewer/issues?q=author%3Ajccguimaraes) [💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=jccguimaraes) 🎨 [📖](https://github.com/jccguimaraes/atom-project-viewer/commits?author=jccguimaraes) 👀 | [<img src="https://avatars.githubusercontent.com/u/1093709?v=3" width="100px;"/><br /><sub>Hans Koch</sub>](https://github.com/Hammster)<br />[💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=Hammster) | [<img src="https://avatars.githubusercontent.com/u/4084322?v=3" width="100px;"/><br /><sub>Holland Wilson</sub>](https://github.com/DamnedScholar)<br />[💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=DamnedScholar) | [<img src="https://avatars.githubusercontent.com/u/7261682?v=3" width="100px;"/><br /><sub>Roman Huba</sub>](https://github.com/amilor)<br />[💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=amilor) | [<img src="https://avatars.githubusercontent.com/u/10619585?v=3" width="100px;"/><br /><sub>Loann Neveu</sub>](https://github.com/lneveu)<br />[💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=lneveu) [🐛](https://github.com/jccguimaraes/atom-project-viewer/issues?q=author%3Alneveu) | [<img src="https://avatars0.githubusercontent.com/u/12634286?v=3&s=460" width="100px;"/><br /><sub>Kristian Barrese</sub>](https://github.com/bitkris-dev)<br />🎨 [🐛](https://github.com/jccguimaraes/atom-project-viewer/issues?q=author%3Abitkris-dev) |
| :---: | :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## Contacts

You can follow me on [Twitter](https://twitter.com/jccguimaraes)

## A Special Thank You!

I thank you all for giving such great feedback! :beers: for everyone.
