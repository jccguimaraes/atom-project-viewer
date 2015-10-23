# Project Viewer

This package was driven by other packages that manage projects but didn't give me all I wanted for my day to basis setup, so I created this package.

Please send comments, issues, bugs, features and other stuff.

### Builds

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![apm downloads](https://img.shields.io/apm/v/project-viewer.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)

### Projects that inspired me! <a id="inspired"></a>

* [tree-view](https://atom.io/packages/tree-view) from *atom*.
* [project-manager](https://atom.io/packages/project-manager) from *danielbrodin*.
* [project-sidebar](https://atom.io/packages/project-sidebar) from *bripkens*.

### Installation <a id="installation"></a>

Simply run the following command:
```sh
apm install project-viewer
```
Or find the package in **Atom → Settings → Install** and search for ***project-viewer***.

### Settings <a id="inspired"></a>

Settings      | Type      | Description                                                                                                                | Default
--------------|-----------|----------------------------------------------------------------------------------------------------------------------------|--------
`startUp`     | `boolean` | Defines if project viewer should be opened from the start of Atom.                                                         | false
`openBuffers` | `boolean` | When changing projects, it will close all files and open only files that were opened before changing/closing that project. | false

### DataBase Configuration <a id="database-configuration"></a>

A JSON file that contains an array of groups and projects (if not present, it will be created automatically).

```js
{
    groups: [],
    projects: []
}
```

### Future features <a id="future-features"></a>
* adding ungrouped projects.
* edit groups/projects (ongoing).
* add ability to open files (buffers) that were opened before quitting or changing projects.
* add travis and stuff alike.
* improve performance and stability.
* sanitize user inputs (allow only specific chars and stuff).
* unit tests (yes, none for now...).
* others (*please contribute with ideas*).

### Other <a id="other"></a>
You can follow me on [Twitter](https://twitter.com/jccguimaraes)
