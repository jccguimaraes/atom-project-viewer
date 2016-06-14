# README
[![Join the chat at https://gitter.im/jccguimaraes/atom-project-viewer](http://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg?style=flat-square)](https://gitter.im/jccguimaraes/atom-project-viewer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![atom version](https://img.shields.io/badge/atom-1.8.0-orange.svg?style=flat-square)](https://atom.io/packages/project-viewer/)
[![apm version](https://img.shields.io/apm/v/project-viewer.svg?style=flat-square)](https://atom.io/packages/project-viewer/)
[![apm downloads](https://img.shields.io/apm/dm/project-viewer.svg?style=flat-square)](https://atom.io/packages/project-viewer/)

This package was driven by other packages that manage projects but didn't gave me what I really wanted for my day to basis setup, so I created this package.

![pv_cgp_01](https://cloud.githubusercontent.com/assets/14871650/15876484/8bfcbc5a-2d05-11e6-90c0-87a38020d78c.gif)

![pv_cgp_02](https://cloud.githubusercontent.com/assets/14871650/15876485/8c13a3b6-2d05-11e6-8f96-bb4ab8acfe9a.gif)


### Projects that inspired me!
* [tree-view](https://atom.io/packages/tree-view) from *atom*.
* [project-manager](https://atom.io/packages/project-manager) from *danielbrodin*.
* [project-sidebar](https://atom.io/packages/project-sidebar) from *bripkens*.

### Installation
Simply run the following command:
```sh
apm install project-viewer
```
Or find the package in **Atom → Settings → Install** and search for ***project-viewer***.

### Options
- `ctrl-alt-cmd-v` open a select view for fast project opening;
- `ctrl-alt-cmd-b` to toggle between sidebar visibility;
- `ctrl-alt-cmd-n` to toggle focus on sidebar;

### Settings
Settings | Type | Description | Default
---------|------|-------------|--------
`startupVisibility` | `Boolean` | Define if you want **project-viewer** to be visible on startup. | `false`
`statusBarVisibility` | `Boolean` | Define if you want **project-viewer** to show active *group* and *project*. | `false`
`autohide` | `Boolean` | Ability to autohide project viewer. | `false`
`panelPosition` | `String` | You can set the place of the viewer, to the most right position or to the most left position. | `Right`
`alwaysOpenInNewWindow` | `Boolean` | If set to true, always open projects in a new window (default Atom's behavior), instead of opening in the same window. | `false`
`hideHeader` | `Boolean` | Hide header (for more space). | `false`
`githubToken` | `String` | Your personal and private GitHub token. This is useful if you want to save/backup your projects to a remote place (as a gist). *note*: keep in mind that this token should have only permissions to `rw` gists as well as that any package can access this token string. | `''`
`convertOldData` | `Boolean` | If you came from a version previous to <code>0.3.0</code>, you most probably have the old data in the atom folder. By default it will always check on startup for this data and if the new does not exist, it will convert to the new data schema. | `true`

## Features & Future Features
Please read the `CHANGE LOG` to have a more insight on all the features existing and planned.

## Contributors
Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/14871650?v=3" width="100px;"/><br /><sub>João Guimarães</sub>](https://github.com/jccguimaraes)<br /><U+1F481> [<U+1F41B>](https://github.com/jccguimaraes/atom-project-viewer/issues?q=author%3Ajccguimaraes) [<U+1F4BB>](https://github.com/jccguimaraes/atom-project-viewer/commits?author=jccguimaraes) <U+1F3A8> [<U+1F4D6>](https://github.com/jccguimaraes/atom-project-viewer/commits?author=jccguimaraes) <U+1F440> | [<img src="https://avatars.githubusercontent.com/u/1093709?v=3" width="100px;"/><br /><sub>Hans Koch</sub>](https://github.com/Hammster)<br />[<U+1F4BB>](https://github.com/jccguimaraes/atom-project-viewer/commits?author=Hammster) | [<img src="https://avatars.githubusercontent.com/u/4084322?v=3" width="100px;"/><br /><sub>Holland Wilson</sub>](https://github.com/DamnedScholar)<br />[<U+1F4BB>](https://github.com/jccguimaraes/atom-project-viewer/commits?author=DamnedScholar) |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

### Other
You can follow me on [Twitter](https://twitter.com/jccguimaraes)
