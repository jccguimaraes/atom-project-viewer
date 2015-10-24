# Project Viewer

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![apm downloads](https://img.shields.io/apm/v/project-viewer.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)

This package was driven by other packages that manage projects but didn't give me all I wanted for my day to basis setup, so I created this package.

Please send comments, issues, bugs, features and other stuff.

**NOTE**: I am sorry for the last updates to have deleted your groups/projects file.

![Project Manager](https://raw.github.com/jccguimaraes/atom-project-viewer/master/project-viewer.gif)

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

### Settings

Settings      | Type      | Description                                                                                                                | Default
--------------|-----------|----------------------------------------------------------------------------------------------------------------------------|--------
`startUp`     | `boolean` | Defines if project viewer should be opened from the start of Atom.                                                         | false
`openBuffers` | `boolean` | Every time you open a file that\'s relative to any of the paths of the project, it will be buffered until you close it manually. Every time you switch projects, they will be restored (setting to **true** will **close** none project files!)                                                        | false

### DataBase Configuration

A JSON file that contains an array of groups and projects (if not present, it will be created automatically).

```js
{
    groups: [],
    projects: []
}
```

### Future features
* adding ungrouped projects.
* edit groups/projects (ongoing).
* add travis and stuff alike.
* improve performance and stability.
* sanitize user inputs (allow only specific chars and stuff).
* unit tests (yes, none for now...).
* others (*please contribute with ideas*).

### Other
You can follow me on [Twitter](https://twitter.com/jccguimaraes)
