# Project Viewer

This package was driven by other packages that manage projects but didn't give me all I wanted for my day to basis setup, so I created this package.

Please send comments, issues, bugs, features and other stuff.

## Table of Contents
  * [Projects that inspired me!](#inspired)
  * [Installation](#installation)
  * [Settings](#settings)
  * [DataBase Configuration](#database-configuration)
  * [Future features](#future-features)
  * [Other](#other)

#### Projects that inspired me! <a id="inspired"></a>

* [tree-view](https://github.com/atom/tree-view/) from *atom*.
* [project-manager](https://github.com/danielbrodin/atom-project-manager/) from *danielbrodin*.
* [project-sidebar](https://github.com/bripkens/project-sidebar/) from *bripkens*.

#### Installation <a id="installation"></a>

Simply run the following command:
```sh
apm install project-viewer
```
Or find the package in **Atom → Settings → Install** and search for ***project-viewer***.

#### Settings <a id="inspired"></a>

Settings  | Type      | Description                                                        | Default
----------|-----------|--------------------------------------------------------------------|--------
`startUp` | `boolean` | Defines if project viewer should be opened from the start of Atom. | false

#### DataBase Configuration <a id="database-configuration"></a>

A JSON file that contains an array of groups and projects.

```js
{
    groups: [],
    projects: []
}
```

#### Future features <a id="future-features"></a>
* adding ungrouped projects.
* edit groups/projects (ongoing).
* add travis and stuff alike.
* improve performance and stability.
* sanitize user inputs (allow only specific chars and stuff).
* unit tests (yes, none for now...).
* others (*please contribute with ideas*).

#### Other <a id="other"></a>
You can follow me on [Twitter](https://twitter.com/jccguimaraes)
