## Working on Feature

- [ ] A decent testing coverage;
- [ ] Drag & Drop `groups` and `projects`;
  - [x] Drag and drop a `group` or `project` into a `group` will add it as a child;
  - [ ] Drag and drop a `group` or `project` into an `project` will add it as sibling of the dropped item;
  - [x] Drag and drop a `group` or `project` into a clear space in the panel will add it as a root child;
  - [ ] Order dragged `group` / `project` accordingly with dropped `group` sorting.
- [ ] Context Menu option to clear selected `project`'s *state* / *context*;
- [ ] Clear individual `project`'s cached state (from **Atom**'s store?);
- [ ] Keep context when switching from `projects` or switch from contexts;
  - > This is available through a config option, default is *switch contexts*.

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
- [ ] Custom selected and hover color on `projects`.
- [ ] Update GitMagic rules;
  - > Need to check all the rules to not be so *aggressive*;

## Issues

- Drag and Drop a group looses all it's children;
- expand / collapse is not stored;
- editor view group list to have also the sorting ability;
- Implement missing `0.3.x` features;
- Fix minimum local file schema properties;

## Performance

- Improve layout rendering each time a change is added
