# README

[![Join the chat at https://gitter.im/jccguimaraes/atom-project-viewer](http://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg?style=flat-square)](https://gitter.im/jccguimaraes/atom-project-viewer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors)

[![atom version](https://img.shields.io/badge/atom-1.10.0-orange.svg?style=flat-square)](https://atom.io/packages/project-viewer/)
[![apm version](https://img.shields.io/apm/v/project-viewer.svg?style=flat-square)](https://atom.io/packages/project-viewer/)
[![apm downloads](https://img.shields.io/apm/dm/project-viewer.svg?style=flat-square)](https://atom.io/packages/project-viewer/)

[![Travis CI CI](https://travis-ci.org/jccguimaraes/atom-project-viewer.svg?branch=master)](https://travis-ci.org/jccguimaraes/atom-project-viewer)
[![AppVeyor CI](https://ci.appveyor.com/api/projects/status/2t91cemmpf635p2e?svg=true
)](https://ci.appveyor.com/project/jccguimaraes/atom-project-viewer)
[![CircleCI CI](https://circleci.com/gh/jccguimaraes/atom-project-viewer/tree/master.svg?style=shield&circle-token=c2215983920e08d193a80b5775760792c5d2e883
)](https://circleci.com/gh/jccguimaraes/atom-project-viewer)

[![Beerpay](https://beerpay.io/jccguimaraes/atom-project-viewer/badge.svg?style=flat-square)](https://beerpay.io/jccguimaraes/atom-project-viewer)
[![paypal](https://img.shields.io/badge/paypal-donate-blue.svg?style=flat-square)](https://paypal.me/jccguimaraes)

This package was driven by other packages that manage projects but didn't gave me what I really wanted for my day to basis setup, so I created this package.

![pv_cgp_01](https://cloud.githubusercontent.com/assets/14871650/15876484/8bfcbc5a-2d05-11e6-90c0-87a38020d78c.gif)

![pv_cgp_02](https://cloud.githubusercontent.com/assets/14871650/15876485/8c13a3b6-2d05-11e6-8f96-bb4ab8acfe9a.gif)

![pv_cgp_03](https://cloud.githubusercontent.com/assets/1093709/16894913/be34c22a-4b65-11e6-8f95-8b8b314f40d5.gif)

## Projects that inspired me!

* [tree-view](https://atom.io/packages/tree-view) from *atom*.
* [project-manager](https://atom.io/packages/project-manager) from *danielbrodin*.
* [project-sidebar](https://atom.io/packages/project-sidebar) from *bripkens*.

## Installation

Simply run the following command:
```sh
apm install project-viewer
```
Or find the package in **Atom → Settings → Install** and search for ***project-viewer***.

## Options
- `shift-ctrl-alt-v` open a select view for fast project opening;
- `shift-ctrl-alt-b` to toggle between sidebar visibility;
- `shift-ctrl-alt-n` to toggle focus on sidebar;

## Settings
Settings | Type | Description | Default
---------|------|-------------|--------
`visibilityState` | `String` | Define what would be the default action for **project-viewer** visibility on startup. Options are `Display on startup` and `Remember state` | `Display on startup`
`visibilityAction` | `Boolean` | 'This `boolean` is relative to the option selected in `Visibility State`. | `true`
`autohide` | `Boolean` | Ability to autohide project viewer. | `false`
`panelPosition` | `String` | You can set the place of the viewer, to the most right position or to the most left position. | `Right`
`alwaysOpenInNewWindow` | `Boolean` | If set to true, always open projects in a new window (default Atom's behavior), instead of opening in the same window. | `false`
`hideHeader` | `Boolean` | Hide header (for more space). | `false`
`githubAccessToken` | `String` | Your personal and private GitHub access token. This is useful if you want to save/backup your projects to a remote place (as a gist). *note*: keep in mind that this token should have only permissions to `rw` gists as well as that any package can access this token string. | `''`
`gistId` | `String` | ID of the gist used as a backup storage. | `''`
`setName` | `String` | Name of your working set, for example 'work' or 'home'. As each working set is backed up into a separate file in one gist, you can have multiple Client/Group/Project sets on different machines and have them all safely backed up on gist. | `default`
`convertOldData` | `Boolean` | If you came from a version previous to <code>0.3.0</code>, you most probably have the old data in the atom folder. By default it will always check on startup for this data and if the new does not exist, it will convert to the new data schema. | `true`
`keepContext` |  `Boolean` | Keep context between project switching. | `false`
`customWidth` | `Number` | Set a custom panel width | `180`
`customSelectedColor` | `String` | Set custom selected project color | `''`
`customHoverColor` | `String` | Set custom hover project color | `''`
`customTitleColor` | `String` | Set custom main title color | `''`
`onlyIcons` | `Boolean` | Show the icons without the description. | `false`

## Features & Future Features
Please read the `CHANGE LOG` to have a more insight on all the features existing and planned.

## Contributors
Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/14871650?v=3" width="100px;"/><br /><sub>João Guimarães</sub>](https://github.com/jccguimaraes)<br />💁 [🐛](https://github.com/jccguimaraes/atom-project-viewer/issues?q=author%3Ajccguimaraes) [💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=jccguimaraes) 🎨 [📖](https://github.com/jccguimaraes/atom-project-viewer/commits?author=jccguimaraes) 👀 | [<img src="https://avatars.githubusercontent.com/u/1093709?v=3" width="100px;"/><br /><sub>Hans Koch</sub>](https://github.com/Hammster)<br />[💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=Hammster) | [<img src="https://avatars.githubusercontent.com/u/4084322?v=3" width="100px;"/><br /><sub>Holland Wilson</sub>](https://github.com/DamnedScholar)<br />[💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=DamnedScholar) | [<img src="https://avatars.githubusercontent.com/u/7261682?v=3" width="100px;"/><br /><sub>Roman Huba</sub>](https://github.com/amilor)<br />[💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=amilor) | [<img src="https://avatars.githubusercontent.com/u/10619585?v=3" width="100px;"/><br /><sub>Loann Neveu</sub>](https://github.com/lneveu)<br />[💻](https://github.com/jccguimaraes/atom-project-viewer/commits?author=lneveu) [🐛](https://github.com/jccguimaraes/atom-project-viewer/issues?q=author%3Alneveu) | [<img src="https://avatars0.githubusercontent.com/u/12634286?v=3&s=460" width="100px;"/><br /><sub>Kristian Barrese</sub>](https://github.com/bitkris-dev)<br />🎨 [🐛](https://github.com/jccguimaraes/atom-project-viewer/issues?q=author%3Abitkris-dev) |
| :---: | :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## Other
You can follow me on [Twitter](https://twitter.com/jccguimaraes)

## A Special Thank You!
I thank all you guys that are and did give great feedback to this project.
:beers: for everyone.

## Support on Beerpay
Hey dude! Help me out for a couple of :beers:!

[![Beerpay](https://beerpay.io/jccguimaraes/atom-project-viewer/badge.svg?style=beer-square)](https://beerpay.io/jccguimaraes/atom-project-viewer)  [![Beerpay](https://beerpay.io/jccguimaraes/atom-project-viewer/make-wish.svg?style=flat-square)](https://beerpay.io/jccguimaraes/atom-project-viewer?focus=wish)
