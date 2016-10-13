# Features

- [x] Group nesting;
  - > There is no more definition of `clients`, `groups` or `projects`,
  only an infinite nesting of groups which can contain
  `items` (previous known as `projects`).
- [x] Sidebar left / right position;
- [x] Auto hide sidebar with hover behavior;
  - > This is available through a config option, default is *not autohide*.
- [x] Traverse and select items with `up` and `down` keys;
- [x] Toggle collapse / expand of groups with `left` and `right` keys;
- [x] Keep context when switching from items or switch from contexts;
  - > This is available through a config option, default is *switch contexts*.
- [x] Clear individual item's cached state (from **Atom**'s store);
- [x] `status-bar` *breadcrumb* information;
- [x] Context Menu option to clear selected project's *state* / *context*;

## Working on Feature

- [ ] Drag & Drop groups and items;
  - [x] Drag and drop a group or item into a group will add it as a child.
  - [ ] Drag and drop a group or item into an item will add it as sibling of the dropped item.
  - [x] Drag and drop a group or item into a clear space in the panel will add it as a root child.

## Not implemented yet

- [ ] Editor for groups / items creation and update;
  - [ ] Bulk operation on items creation;
    * > Ability to create items when more than one path is provided.
  - [ ] Custom colors for groups and items;
  - [ ] List of icons in editor as *only icons* or *icon and description*;
    * > This is available through a config option, default is *icon and description*.
- [ ] Context Menu option to open item in a new window or vice versa;
- [ ] Old database schemas conversion tools;
- [ ] Provide an API Service for managing outside groups and items;
- [ ] Multiple backup services (*Gist* and *Goggle Drive*);
  * > No more than these 2 services.
- [ ] Resizable pane (*needs investigation*);
    - > This is also available through a config option which will switch between what is the primary option, defaults to open in *same window*.

## Issues

- First time switching to a new added project (even on reload), will not update `status-bar`;
  - > Can replicate when clearing state.
