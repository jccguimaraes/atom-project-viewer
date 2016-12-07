# README

[![Join the chat at https://gitter.im/jccguimaraes/atom-project-viewer](http://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg?style=flat-square)](https://gitter.im/jccguimaraes/atom-project-viewer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors)

[![atom version](https://img.shields.io/badge/atom-1.12.5-orange.svg?style=flat-square)](https://atom.io/packages/project-viewer/)
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
* [Shortcuts](#shortcuts)
* [Settings](#settings)
* [Contributors](#contributors)
* [Contacts](#contacts)
* [A Special Thank You!](#a-special-thank-you)

## Introduction

This is a package built for and by the Atom community. For contribution read [below](#contributors).

## Installation

In a terminal / command line write the following line:

```sh
apm install project-viewer
```

Or simply find the package by accessing the menu **Atom → Preferences... → Install** and search for ***project-viewer***.

## Shortcuts

- `shift-ctrl-alt-c` toggles sidebar autohide;
- `shift-ctrl-alt-v` toggles sidebar visibility;
- `shift-ctrl-alt-n` open the editor tab;
- `shift-ctrl-alt-m` toggle focus from active panel and the sidebar;
- `shift-ctrl-alt-l` toggle the select list modal;

## Settings

Settings | Type | Description | Default
---------|------|-------------|--------
visibilityOption | `String` | Define what would be the default action for **project-viewer** visibility on startup. | `Display on startup`
visibilityActive | `Boolean` | Relative to the interaction option selected above. | `true`
panelPosition | `String` | Position the panel to the left or right of the main pane. | `Right`
autoHide | `Boolean` | Panel has auto hide with hover behavior. | `false`
hideHeader | `Boolean` | You can have more space for the list by hiding the header. | `false`
keepContext | `Boolean` | When switching from items, if set to `true`, will keep current context. Also will not save contexts between switching. | `false`
openNewWindow | `Boolean` | Always open items in a new window. | `false`
statusBar | `Boolean` | Will show the breadcrumb to the current opened project in the `status-bar`. | `false`

> Keep in mind that this package uses Atom's Storage to save all groups and projects. It is wise to save it to the cloud (ex: you can import and export a private Gist through this package!).

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/14871650?v=3" width="100px;"/><br /><sub>João Guimarães</sub>](https://github.com/jccguimaraes)<br />💁 [🐛](https://github.com/jccguimaraes/atom-project-viewer/issues?q=author%3Ajccguimaraes) [💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=jccguimaraes) 🎨 [📖](https://github.com/jccguimaraes/atom-project-viewer/commits?author=jccguimaraes) 👀 | [<img src="https://avatars.githubusercontent.com/u/1093709?v=3" width="100px;"/><br /><sub>Hans Koch</sub>](https://github.com/Hammster)<br />[💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=Hammster) | [<img src="https://avatars.githubusercontent.com/u/4084322?v=3" width="100px;"/><br /><sub>Holland Wilson</sub>](https://github.com/DamnedScholar)<br />[💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=DamnedScholar) | [<img src="https://avatars.githubusercontent.com/u/7261682?v=3" width="100px;"/><br /><sub>Roman Huba</sub>](https://github.com/amilor)<br />[💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=amilor) | [<img src="https://avatars.githubusercontent.com/u/10619585?v=3" width="100px;"/><br /><sub>Loann Neveu</sub>](https://github.com/lneveu)<br />[💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=lneveu) [🐛](https://github.com/jccguimaraes/atom-project-viewer/issues?q=author%3Alneveu) | [<img src="https://avatars0.githubusercontent.com/u/12634286?v=3&s=460" width="100px;"/><br /><sub>Kristian Barrese</sub>](https://github.com/bitkris-dev)<br />🎨 [🐛](https://github.com/jccguimaraes/atom-project-viewer/issues?q=author%3Abitkris-dev) |
| :---: | :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## Contacts

You can follow me on [Twitter](https://twitter.com/jccguimaraes)

## A Special Thank You!

I thank you all for giving such great feedback! :beers: for everyone.
