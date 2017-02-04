## Working on Feature

- [ ] A decent testing coverage;
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
- [ ] Backup services (*Gist* and *Goggle Drive*);
  - > No more than these 2 services.
  - > This is also available through a config option which will switch between what is the primary option, defaults to open in *same window*.
- [ ] Custom selected and hover color on `projects`.
- [ ] Update GitMagic rules;
  - > Need to check all the rules to not be so *aggressive*;
- [ ] Each Group has a project counter

## Issues

- Implement missing `0.3.x` features;
- Fix minimum local file schema properties;
- closing atom and reopening will not open last project (this is internal to atom)

## Performance

- Improve layout rendering each time a change is added
