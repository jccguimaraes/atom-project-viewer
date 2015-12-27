# Project Viewer

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![apm version](https://img.shields.io/apm/v/project-viewer.svg?style=flat-square)](https://atom.io/packages/project-viewer/)
[![apm downloads](https://img.shields.io/apm/dm/project-viewer.svg?style=flat-square)](https://atom.io/packages/project-viewer/)

This package was driven by other packages that manage projects but didn't gave me what I really wanted for my day to basis setup, so I created this package.

Please send comments, issues, bugs, features and other stuff.

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

Settings | Type | Description | Default
---------|------|-------------|--------
`startUp` | `boolean` | Defines if project viewer should be opened from the start of Atom. | false
`openBuffers` | `boolean` | Every time you open a file that's relative to any of the paths of the project, it will be buffered until you close it manually. Every time you switch projects, they will be restored (setting to **true** will **close** none project files!) | false
`foldersCollapsed` | `boolean` | Defines if folders should always be collapsed when switching/opening the project. | false
`onlyGroupColors` | `boolean` | If set to true, will only color the group and not the projects. | false

### File Configuration

A JSON file that contains an array of groups and projects (if not present, it will be created automatically).

```js
{
    "groups": [],
    "projects": []
}
```

##### Defining a group at this moment is as simple as:

```js
{
    "name": "my-group",
    "icon": "icon-octicons",
    "expanded": false,
    "color": "#fafafa"
}
```
Setting | Type | Require | Description
--------|------|---------|------------
`name` | String | true | The name of the group.
`icon` | String | optional | An icon showing next to the group name. As listed from Atom's octicons set.
`expanded` | Boolean | optional | Sets if group should be expanded from the start.
`color` | String | optional | Sets the group and it's child project color (only accepts hex strings).

##### Defining a project is a little bit more complex:

```js
{
	"name": "my-project",
    "group": "my-group",
	"paths": {
		"absolute-path-to-folder-1": "a-stringified-object-with-folder-states",
		"absolute-path-to-folder-2": "a-stringified-object-with-folder-states"
	},
	"buffers": [
		"absolute-path-file"
	]
}
```

Defining a project at this moment is a little bit more complex:

Setting | Type | Require | Description
--------|------|---------|------------
`name` | String | true | The name of the project.
`group` | String | optional | The name of the group which this project belongs to. If none, it will be grouped in the ungrouped projects.
`paths` | Object | optional | An object which keys are the project folders to show in the *tree view* and their values are the state of it's children folders (expanded or collapsed).
`buffers` | Array | optional | An array of files that were opened before closing the project/Atom or switching to another project.

### Features

This is a resume of all the features of the package

* Context menu for adding, removing and editing groups and projects.
* Icons in groups.
* Set custom color for a group and it's child projects.
* Expanding and collapsing groups.
* Group ungrouped projects. *(not yet)*.
* Keep opened files when switching between projects. *(currently buggy)*.
* Keep state of project folders.
* Drag projects from a group to another one.

### Future features

* Add travis and stuff alike.
* Improve performance and stability.
* Sanitize user inputs (allow only specific chars and stuff).
* Add unit tests (on refactor)
* Others (*please contribute with ideas*).

### Future

This project has increased a lot and fast since my first release and I have decided to make an huge refactor on the code so that it can follow as much as closer to Atom's guidelines and ideals.
Until now, just closing some issues and finishing the features I had planned earlier.

Once again, I am opened for new ideas and features. Give me a shout.

### Other

You can follow me on [Twitter](https://twitter.com/jccguimaraes)
