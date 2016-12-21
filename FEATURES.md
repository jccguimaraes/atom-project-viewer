# Features

- [x] Group nesting;
  - > Infinite nesting of `groups` which can contain also `projects`;
  - > `projects` can be at any level.
- [x] Sidebar Left / Right (first or last) position;
- [x] Auto hide sidebar with hover behavior;
- [x] Resizable panel;
- [x] Hide header for more space;
  - > This is available through a config option, default is *not autohide*.
- [x] Focus toggle;
  - > Toggling focus will switch between current active element and the panel.
- [x] Keep context when switching from `projects` or switch from contexts;
  - > This is available through a config option, default is *switch contexts*.
- [x] `SelectListView` integration;
  - > Only shows `projects`.
- [x] Traverse and select `projects` with `up` and `down` keys;
- [x] Toggle collapse / expand of `groups` with `left` and `right` keys;
  - > *Double click* to default width;
- [x] `status-bar` with the `project`'s' *breadcrumb* path;
- [x] Open the local database file for direct editing;
- [x] Old database schemas conversion tools;
- [x] Editor for groups / `projects` creation and update;
  - [x] Create, update and remove `group` or `project`;
  - [x] Automatic set it's name according to first path base name added;
  - [x] Bulk operation on a `project` creation;
    - > Ability to create individual `projects` when more than one path is provided;
    - > Each project will automatically have it's name set to it's path base name.
  - [x] Filtering icons;
  - [x] List of icons in editor as *only icons* or *icon and description*;
    - > This is available through a config option, default is *icon and description*.

## Working on Feature

- [ ] A decent testing coverage;
- [ ] Drag & Drop `groups` and `projects`;
  - [x] Drag and drop a `group` or `project` into a `group` will add it as a child;
  - [ ] Drag and drop a`group` or `project` into an `project` will add it as sibling of the dropped item;
  - [x] Drag and drop a `group` or `project` into a clear space in the panel will add it as a root child;
  - [ ] Order dragged `group` / `project` accordingly with dropped `group` sorting.
- [ ] Context Menu option to clear selected `project`'s *state* / *context*;
- [ ] Clear individual `project`'s cached state (from **Atom**'s store?);

## Not implemented yet

- [ ] refactor switching context workflow;
- [ ] Override settings by `project`;
  - [ ] Custom colors for groups and `project`;
  - [ ] Sorting children;
- [ ] Context Menu option to open `project` in a new window or vice versa;
- [ ] Provide an API Service for managing outside `groups` and `projects`;
- [ ] Multiple backup services (*Gist* and *Goggle Drive*);
  - > No more than these 2 services.
  - > This is also available through a config option which will switch between what is the primary option, defaults to open in *same window*.
- [ ] No `groups` or `projects` message;
- [ ] Custom selected and hover color on `projects`.
- [ ] Update GitMagic rules;
  - > Need to check all the rules to not be so *aggressive*;

## Issues

- [ ] Linter does not switch context;
- [ ] Context is not working proper;
- [ ] expand / collapse is not stored;
