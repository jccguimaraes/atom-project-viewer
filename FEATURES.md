## TODO

- A decent testing coverage;

## Future Features / Improvements

- Update GitMagic rules;
  - > Need to check all the rules to not be so *aggressive*;
- Provide an API Service for managing outside `groups` and `projects`;
- Override settings by `project`;
- Refactor switching context workflow;
- Clear individual `project`'s cached state (from **Atom**'s store?);
    - > Context Menu option to clear selected `project`'s *state* / *context*.
- Filtering input over list.

## Issues

- Fix minimum local file schema properties;
- closing atom and reopening will not open last project (this is internal to atom);
- when in editor mode, try to have a listener for the paths changing and other information (not a MUST);

## Performance

- Improve UI refreshing! :see_no_evil:
