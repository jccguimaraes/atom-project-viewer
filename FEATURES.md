## TODO

- Keep context when switching from `projects` or switch from contexts;
  - > This is available through a config option, default is *switch contexts*.
- Context Menu option to open `project` in a new window or vice versa;
- Backup services (*Gist* and *Goggle Drive*);
  - > No more than these 2 services.
  - > This is also available through a config option which will switch between what is the primary option, defaults to open in *same window*.
- Implement missing `0.3.x` features;
- A decent testing coverage;

## Future Features / Improvements

- Update GitMagic rules;
  - > Need to check all the rules to not be so *aggressive*;
- Provide an API Service for managing outside `groups` and `projects`;
- Override settings by `project`;
- refactor switching context workflow;
- Clear individual `project`'s cached state (from **Atom**'s store?);
    - > Context Menu option to clear selected `project`'s *state* / *context*;
- Filtering input over list

## Issues

- Fix minimum local file schema properties;
- closing atom and reopening will not open last project (this is internal to atom)

## Performance

- Improve UI refreshing! :see_no_evil:
