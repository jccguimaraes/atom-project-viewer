# Features

- [x] Group nesting;
  - > Infinite nesting of `groups` which can contain also `projects`;
  - > `projects` can be at any level.
- [x] Sidebar Left / Right (first or last) position;
- [x] Auto hide sidebar with hover behavior;
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
- [x] Resizable panel;
  - > *Double click* to default width;

## Working on Feature

- [ ] Editor for groups / `projects` creation and update;
  - [ ] Bulk operation on `project` creation;
    - > Ability to create individual `projects` when more than one path is provided.
- [ ] `status-bar` with the `project`'s' *breadcrumb* path;
- [ ] Context Menu option to clear selected `project`'s *state* / *context*;
- [ ] Clear individual `project`'s cached state (from **Atom**'s store?);
- [ ] Drag & Drop `groups` and `projects`;
  - [x] Drag and drop a `group` or `project` into a `group` will add it as a child;
  - [ ] Drag and drop a`group` or `project` into an `project` will add it as sibling of the dropped item;
  - [x] Drag and drop a `group` or `project` into a clear space in the panel will add it as a root child;
  - [ ] Order dragged `group` / `project` accordingly with dropped `group` sorting.

## Not implemented yet

- [ ] Override settings by `project`;
  - [ ] Custom colors for groups and `project`;
  - [ ] Sorting children;
  - [ ] List of icons in editor as *only icons* or *icon and description*;
    - > This is available through a config option, default is *icon and description*.
- [ ] Context Menu option to open `project` in a new window or vice versa;
- [ ] Old database schemas conversion tools;
- [ ] Provide an API Service for managing outside `groups` and `projects`;
- [ ] Multiple backup services (*Gist* and *Goggle Drive*);
  - > No more than these 2 services.
  - > This is also available through a config option which will switch between what is the primary option, defaults to open in *same window*.
- [ ] Update GitMagic rules;
  - > Need to check all the rules to not be so *aggressive*;
- [ ] No `groups` or `projects` message.

## Issues

- First time switching to a new added `project` (even on reload), will not update `status-bar`;
  - > Can replicate when clearing state.
- Linter does not switch context;
- Context is not working proper;
