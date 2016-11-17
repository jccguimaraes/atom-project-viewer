# Features

- [x] Group nesting;
  - > There is no more definition of `clients`, `groups` or `projects`,
  only an infinite nesting of `groups` which can contain
  `projects` or simply just contain `projects` without being part of a `group`.
- [x] Sidebar left / right position;
- [x] Auto hide sidebar with hover behavior;
  - > This is available through a config option, default is *not autohide*.
- [x] Focus toggle;
  - > Toggling focus will switch between current active element and the panel.
- [x] Keep context when switching from `projects` or switch from contexts;
  - > This is available through a config option, default is *switch contexts*.
- [x] `SelectListView` integration;
  - > Will only show `projects`.

## Working on Feature

- [ ] `status-bar` with the `project`'s' *breadcrumb* path;
- [ ] Context Menu option to clear selected `project`'s *state* / *context*;
- [ ] Clear individual `project`'s cached state (from **Atom**'s store?);
- [ ] Traverse and select `projects` with `up` and `down` keys;
- [ ] Toggle collapse / expand of `groups` with `left` and `right` keys;
- [ ] Drag & Drop `groups` and `projects`;
  - [x] Drag and drop a `group` or `project` into a `group` will add it as a child;
  - [ ] Drag and drop a`group` or `project` into an `project` will add it as sibling of the dropped item;
  - [x] Drag and drop a `group` or `project` into a clear space in the panel will add it as a root child;
  - [ ] Order dragged `group` / `project` accordingly with dropped `group` sorting.

## Not implemented yet

- [ ] Editor for groups / `projects` creation and update;
  - [ ] Bulk operation on `project` creation;
    - > Ability to create `project` when more than one path is provided.
  - [ ] Custom colors for groups and `project`;
  - [ ] Sorting children;
  - [ ] List of icons in editor as *only icons* or *icon and description*;
    - > This is available through a config option, default is *icon and description*.
- [ ] Context Menu option to open `project` in a new window or vice versa;
- [ ] Old database schemas conversion tools;
- [ ] Provide an API Service for managing outside `groups` and `projects`;
- [ ] Multiple backup services (*Gist* and *Goggle Drive*);
  - > No more than these 2 services.
- [ ] Resizable pane (*needs investigation*);
  - > This is also available through a config option which will switch between what is the primary option, defaults to open in *same window*.
- [ ] Update GitMagic rules;
  - > Need to check all the rules to not be so *aggressive*.

## Issues

- First time switching to a new added `project` (even on reload), will not update `status-bar`;
  - > Can replicate when clearing state.
- When switching from the `SelectListView` project ain't selected in the sidebar.
