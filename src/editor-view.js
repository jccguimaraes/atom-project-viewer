const {CompositeDisposable} = require('atom');
const nodePath = require('path');
const map = require('./map');
const domBuilder = require('./dom-builder');
const {
  buildBlock, buildHeader, buildInput, buildButton, buildLabel
} = require('./common');
const octicons = require('./json/octicons.json');
const devicons = require('./json/devicons.json');
const database = require('./database');
const {
  getView, getViewFromModel, getCurrentOpenedProject
} = require('./common');

const getType = function _getType () {
  const context = map.get(this);
  const selected = context.refs['pv-input-type'];
  if (!selected && context.candidate && context.candidate.type) {
    return context.candidate.type;
  }
  else if (!selected && context.model && context.model.type) {
    return context.model.type;
  }
  if (!context.refs['pv-input-type']) { return; }
  return context.refs['pv-input-type'].getAttribute('data-pv-type');
};

const getName = function _getName (context) {
  if (!context) { context = map.get(this); }
  const view = context.refs['pv-input-name'];
  if (!view) { return; }
  return view.value;
};

const getSelectedSortBy = function _getSelectedSortBy () {
  const context = map.get(this);
  const view = context.refs['pv-select-sortBy'];
  if (!view) { return; }
  const selected = view.selectedOptions[0];
  if (!selected) { return; }
  return selected.value;
};

const getSelectedIcon = function _getSelectedIcon () {
  const context = map.get(this);
  const view = context.refs['pv-selected-icon'];
  if (!view) { return; }
  return view.getAttribute('data-pv-icon');
};

const getSelectedColor = function _getSelectedColor () {
  const context = map.get(this);
  const enabled = context.refs['pv-color-enabled'];
  if (!enabled) { return; }
  const view = context.refs['pv-input-color'];
  if (!view) { return; }
  return view.value;
};

const getSelectedPaths = function _getSelectedPaths () {
  const context = map.get(this);
  return context.refs['pv-list-paths'];
};

const getSelectedGroup = function _getSelectedGroup () {
  const context = map.get(this);
  const view = context.refs['pv-group-selected'];
  if (!view) { return; }
  const uuid = view.getAttribute('data-project-viewer-uuid');
  const viewForModel = document.querySelector(
    `project-viewer li[data-project-viewer-uuid="${uuid}"]`
  );
  if (!viewForModel) { return; }
  return {
    view: viewForModel,
    model: map.get(viewForModel)
  };
};

const detachedCallback = function _detachedCallback () {
  this.disposables.dispose();
};

const attachedCallback = function _attachedCallback () {
  this.disposables = new CompositeDisposable();
  this.classList.add('native-key-bindings', 'pv-has-icons');
  const context = map.get(this);
  if (context.model) {
    this.setAttribute('data-pv-uuid', context.model.uuid);
  }
};

const getTitle = function _getTitle () {
  let context = map.get(this);
  if (context && context.model && context.model.name) {
    return `PV Editor - ${context.model.name}`;
  }
  return 'PV Editor';
};

const closeEditor = function _closeEditor () {
  atom.workspace.getActivePane().destroyActiveItem();
};

const actionsContainer = function _actionsContainer (parentView) {
  const context = map.get(this);
  const actionsBlock = buildBlock();
  const cancelButton = buildButton('Cancel', 'warning');
  const deleteButton = buildButton('Delete', 'error');
  const successButton = buildButton(
    context.model && !context.candidate ? 'Update' : 'Create', 'success'
  );

  context.refs['pv-button-cancel'] = cancelButton;
  context.refs['pv-button-success'] = successButton;

  cancelButton.addEventListener('click', clickCancelButton.bind(this), false);
  deleteButton.addEventListener('click', clickDeleteButton.bind(this), false);
  successButton.addEventListener('click', clickSuccessButton.bind(this), false);

  actionsBlock.appendChild(cancelButton);
  if (context.model && (context.candidate && context.candidate.type)) {
    actionsBlock.appendChild(deleteButton);
    context.refs['pv-button-delete'] = deleteButton;
  }
  actionsBlock.appendChild(successButton);

  parentView.appendChild(actionsBlock);
};

const typeContainer = function _typeContainer (parentView) {
  const context = map.get(this);

  const typeBlock = buildBlock();
  const typeHeader = buildHeader('Type');
  const typeGroupInput = buildInput('radio', 'type-group');
  const typeProjectInput = buildInput('radio', 'type-project');

  const typeGroupLabel = buildLabel('Group', 'type-group', typeGroupInput);
  const typeProjectLabel = buildLabel(
    'Project', 'type-group', typeProjectInput
  );

  context.refs['pv-type-group'] = typeGroupInput;
  context.refs['pv-type-project'] = typeProjectInput;

  typeGroupLabel.addEventListener(
    'click',
    clickType.bind(this, context),
    false
  );
  typeProjectLabel.addEventListener(
    'click',
    clickType.bind(this, context),
    false
  );

  typeGroupInput.setAttribute('data-pv-type', 'group');
  typeProjectInput.setAttribute('data-pv-type', 'project');

  if (context.candidate && context.candidate.hasOwnProperty('type')) { return; }
  if (!context.candidate && context.model) {return; }
  typeBlock.appendChild(typeHeader);
  typeBlock.appendChild(typeGroupLabel);
  typeBlock.appendChild(typeProjectLabel);
  parentView.appendChild(typeBlock);
};

const nameContainer = function _setName (parentView) {
  const context = map.get(this);
  const nameBlock = buildBlock();
  const nameHeader = buildHeader('Name');
  const nameInput = buildInput('text', 'name');

  context.refs['pv-container-name'] = nameBlock;
  context.refs['pv-input-name'] = nameInput;

  if (context.model) {
    nameInput.value = context.model.name || '';
  }

  nameBlock.appendChild(nameHeader);
  nameBlock.appendChild(nameInput);
  parentView.appendChild(nameBlock);
};

const sortByContainer = function _sortByContainer (parentView) {
  const context = map.get(this);
  const sortByBlock = buildBlock();
  const sortByHeader = buildHeader('Sort By');

  context.refs['pv-container-sortBy'] = sortByBlock;

  const sortBySelect = document.createElement('select');
  sortBySelect.classList.add('input-select', 'pv-select-sortBy');
  if (context.refs) {
    context.refs['pv-select-sortBy'] = sortBySelect;
  }

  const sortBy = [
    'alphabetically',
    'reverse-alphabetically',
    'position',
    'reverse-position'
  ];

  sortBy.forEach(
    (sortBy) => {
      const sortByOption = document.createElement('option');
      sortByOption.textContent = sortBy;
      if (context.model && context.model.sortBy === sortBy) {
        sortByOption.setAttribute('selected', true);
      }
      sortBySelect.appendChild(sortByOption);
    }
  );

  sortByBlock.appendChild(sortByHeader);
  sortByBlock.appendChild(sortBySelect);

  parentView.appendChild(sortByBlock);
};

const iconContainer = function _iconContainer (parentView) {
  const context = map.get(this);
  const onlyIcons = atom.config.get('project-viewer.onlyIcons');
  const iconBlock = buildBlock();
  const iconHeader = buildHeader('Icons');
  const iconInput = buildInput('search', 'icon');

  iconInput.addEventListener('keyup', function (evt) {
    const searchPattern = evt.target.value.replace(/\W+/g, '');
    Array.from(iconList.childNodes).forEach(function (iconView) {
      const currentIcon = iconView.getAttribute('data-pv-icon');
      const isMatch = currentIcon.search(searchPattern) !== -1;
      iconView.classList.toggle('hidden', !!searchPattern.length && !isMatch);
    });
  }, false);

  iconInput.addEventListener('search', function (evt) {
    const searchPattern = evt.target.value.replace(/\W+/g, '');
    Array.from(iconList.childNodes).forEach(function (iconView) {
      const currentIcon = iconView.getAttribute('data-pv-icon');
      const isMatch = currentIcon.search(searchPattern) !== -1;
      iconView.classList.toggle('hidden', !!searchPattern.length && !isMatch);
    });
  }, false);

  context.refs['pv-container-icons'] = iconBlock;

  const iconList = document.createElement('div');
  iconList.classList.add('block', 'icons-list');
  iconList.classList.toggle('only-icons', onlyIcons);

  octicons.list.concat(devicons.list).forEach(
    (icon) => {
      const iconView = document.createElement('span');
      if (onlyIcons) {
        atom.tooltips.add(iconView, {
          title: icon,
          delay: {show: 100, hide: 100}
        });
      }
      else {
        iconView.textContent = icon;
      }
      const iconType = icon.split('-')[0];
      iconView.classList.add('inline-block-tight', iconType, icon);
      iconView.setAttribute('data-pv-icon', icon);
      iconView.addEventListener(
        'click',
        clickIconView.bind(this, iconView),
        false
      );
      iconList.appendChild(iconView);

      if (context.model && context.model.icon === icon) {
        iconView.classList.add('highlight-success');
        context.refs['pv-selected-icon'] = iconView;
      }
    }
  );

  iconBlock.appendChild(iconHeader);
  iconBlock.appendChild(iconInput);
  iconBlock.appendChild(iconList);

  parentView.appendChild(iconBlock);
};

const clickCustomColor = function _clickCustomColor (context, evt) {
  if (evt.target.parentNode.hasAttribute('hidden')) { return; }
  const color = evt.target.getAttribute('data-pv-palette');
  if (!color) { return; }
  context.refs['pv-input-color'].value = color;
};

const addCustomColor = function _addCustomColor(context, color) {
  const palette = document.createElement('div');
  palette.classList.add('pv-palette');
  palette.addEventListener(
    'click',
    clickCustomColor.bind(null, context),
    false
  );
  palette.setAttribute('style', `background-color: ${color}`)
  palette.setAttribute('data-pv-palette', color);
  context.refs['pv-color-palette'].appendChild(palette);
};

const colorContainer = function _colorContainer (parentView) {
  const context = map.get(this);

  const colorBlock = buildBlock();
  const colorHeader = buildHeader('Color');
  const colorInput = buildInput('color', 'color');
  const toggleColorInput = buildInput('checkbox', 'checkbox-color');
  const toggleColorLabel = buildLabel(
    'Enable color',
    'toggle-color',
    toggleColorInput
  );
  const colorPalette = document.createElement('div');
  const colorPaletteText = document.createElement('p');

  context.refs['pv-input-color'] = colorInput;
  context.refs['pv-container-color'] = colorBlock;
  context.refs['pv-color-palette'] = colorPalette;

  toggleColorLabel.classList.add('inliner');
  toggleColorLabel.addEventListener(
    'click',
    clickToggleColor.bind(context),
    false
  );

  colorPaletteText.classList.add('pv-palette-info');
  colorPaletteText.textContent = 'quick picker'
  colorPalette.appendChild(colorPaletteText);
  colorPalette.classList.add('pv-color-palette');
  atom.config.get('project-viewer.customPalette').forEach(
    addCustomColor.bind(null, context)
  );

  colorBlock.appendChild(colorHeader);
  colorBlock.appendChild(toggleColorLabel);
  colorBlock.appendChild(colorInput);
  colorBlock.appendChild(colorPalette);

  parentView.appendChild(colorBlock);

  if (context.model && context.model.color) {
    colorInput.value = context.model.color;
    colorInput.disabled = !context.model.color;
    colorPalette.hidden = colorInput.disabled;
    toggleColorInput.checked = !!context.model.color;
  }
  else if (context.candidate && context.candidate.color) {
    colorInput.value = context.candidate.color;
    colorInput.disabled = !context.candidate.color;
    colorPalette.hidden = colorInput.disabled;
    toggleColorInput.checked = !!context.candidate.color;
  }
  else {
    colorInput.disabled = true;
    colorPalette.hidden = true;
    toggleColorInput.checked = false;
  }

  context.refs['pv-color-enabled'] = toggleColorInput.checked;
};

const optionsContainer = function _optionsContainer (parentView) {
  const context = map.get(this);
  const optionsBlock = buildBlock();
  const optionsHeader = buildHeader('Options');
  const devModeInput = buildInput('checkbox', 'checkbox-devMode');
  const devModeLabel = buildLabel('Open in Dev Mode', 'devMode', devModeInput);

  context.refs['pv-container-options'] = optionsBlock;

  optionsBlock.appendChild(optionsHeader);
  optionsBlock.appendChild(devModeLabel);
  parentView.appendChild(optionsBlock);
};

const clickBulkCheckbox = function _clickBulkCheckbox (context) {
  context.refs['pv-bulk-operation'] = !context.refs['pv-bulk-operation'];
  activateContainers.call(null, {
    name: !context.refs['pv-bulk-operation']
  }, context);
};


const removePath = function _removePath (parentView) {
  const cPath = parentView.querySelector('.pv-path-name').textContent;
  parentView.remove();
  const idx = this.refs['pv-list-paths'].indexOf(cPath);
  if (idx !== -1) {
    this.refs['pv-list-paths'].splice(idx, 1);
  }
};

const clickPathsButton = function _clickPathsButtons (context, parentView) {
  atom.pickFolder(addPaths.bind(null, context, parentView))
};

const addPaths = function _addPaths (context, parentView, paths) {
  if (!paths) { return; }
  paths.forEach(addPath.bind(null, context, parentView));
};

const addPath = function _addPath (context, parentView, path) {
  if (context.refs['pv-list-paths'].indexOf(path) !== -1) {
    return;
  }
  context.refs['pv-list-paths'].push(path);

  if (context.refs['pv-list-paths'].length === 1 && !getName(context)) {
    const name = nodePath.basename(context.refs['pv-list-paths'][0]);
    context.refs['pv-input-name'].value = name;
  }

  const listItem = document.createElement('li');
  const listItemSpanRemove = document.createElement('span');
  const listItemSpan = document.createElement('span');

  listItem.classList.add('list-item');
  listItemSpanRemove.classList.add(
    'icon', 'icon-remove-close', 'pv-path-remove', 'text-error'
  );
  listItemSpanRemove.addEventListener(
    'click',
    removePath.bind(context, listItem),
    false
  );
  listItemSpan.classList.add('pv-path-name', 'text-info');
  listItemSpan.textContent = path;

  listItem.appendChild(listItemSpanRemove);
  listItem.appendChild(listItemSpan);
  parentView.appendChild(listItem);
};

const pathsContainer = function _pathsContainer (parentView) {
  const context = map.get(this);

  const pathsBlock = buildBlock();
  const pathsHeader = buildHeader('Paths');
  const bulkInput = buildInput('checkbox', 'checkbox-bulk');
  const bulkLabel = buildLabel('Each path is a project', 'bulk', bulkInput);
  const pathsButton = buildButton('Add project folder(s)', 'primary');
  const pathsList = document.createElement('ul');

  context.refs['pv-bulk-operation'] = false;
  context.refs['pv-list-paths'] = [];

  pathsButton.addEventListener(
    'click',
    clickPathsButton.bind(null, context, pathsList),
    false
  );

  bulkLabel.addEventListener(
    'click',
    clickBulkCheckbox.bind(null, context),
    false
  );

  context.refs['pv-container-paths'] = pathsBlock;

  pathsBlock.classList.add('pv-block-paths');
  bulkLabel.classList.add('inliner');
  pathsButton.classList.add('pv-button-paths');

  pathsList.classList.add('list-group');

  pathsBlock.appendChild(pathsHeader);
  pathsBlock.appendChild(pathsButton);

  if (!context.model || (context.candidate && context.candidate.paths)) {
    pathsBlock.appendChild(bulkLabel);
  }
  pathsBlock.appendChild(pathsList);

  parentView.appendChild(pathsBlock);

  if (context.model && Array.isArray(context.model.paths)) {
    context.model.paths.forEach(addPath.bind(null, context, pathsList));
  }
  else if (context.candidate && Array.isArray(context.candidate.paths)) {
    context.candidate.paths.forEach(addPath.bind(null, context, pathsList));
  }
};

const groupsContainer = function _parentContainer (parentView) {
  const context = map.get(this);
  const groupsBlock = buildBlock();
  const groupsHeader = buildHeader('Groups');

  context.refs['pv-container-groups'] = groupsBlock;

  const listTree = document.createElement('ul');
  listTree.classList.add('list-tree', 'groups-list');

  let parentGroupModel;
  if (context.model) {
      parentGroupModel = Object.getPrototypeOf(context.model);
  }
  if (context.candidate) {
      parentGroupModel = Object.getPrototypeOf(context.candidate);
  }

  database.fetch().some(function databaseFetch (entry) {
    if (entry.type === 'group') {
      const listNestedItem = document.createElement('li');
      const listItem = document.createElement('div');
      const listNestedTree = document.createElement('ul');
      listNestedItem.classList.add('list-nested-item');
      listItem.classList.add('list-item');
      if (entry === parentGroupModel) {
        listNestedItem.classList.add('selected');
        context.refs['pv-group-selected'] = listNestedItem;
      }
      if (entry === context.model) {
        listNestedItem.classList.add('hidden');
      }
      listNestedTree.classList.add('list-tree');
      listNestedItem.setAttribute('data-project-viewer-uuid', entry.uuid);
      listItem.textContent = entry.name;
      listNestedItem.appendChild(listItem);
      listNestedItem.appendChild(listNestedTree);

      listItem.addEventListener(
        'click',
        clickListItem.bind(null, context),
        false
      );

      const proto = Object.getPrototypeOf(entry);

      if (proto.type === 'group') {
        const treeView = listTree.querySelector(
          `li[data-project-viewer-uuid="${proto.uuid}"] .list-tree`
        );
        treeView.appendChild(listNestedItem);
        return;
      }

      listTree.appendChild(listNestedItem);

      return false;
    }
  });

  groupsBlock.appendChild(groupsHeader);
  groupsBlock.appendChild(listTree);

  parentView.appendChild(groupsBlock);
};

const configContainer = function _configContainer () {};

const activateContainers = function _activateContainer (list, context) {
  if (!context) { context = map.get(this); }

  let tabIndex = 1;

  if (context.refs['pv-button-cancel']) {
    context.refs['pv-button-cancel'].tabIndex = tabIndex;
    tabIndex++;
  }

  if (context.refs['pv-button-delete']) {
    context.refs['pv-button-delete'].tabIndex = tabIndex;
    tabIndex++;
  }

  if (context.refs['pv-button-success']) {
    context.refs['pv-button-success'].tabIndex = tabIndex;
    tabIndex++;
  }

  if (context.refs['pv-type-group']) {
    context.refs['pv-type-group'].tabIndex = tabIndex;
    tabIndex++;
  }

  if (context.refs['pv-type-project']) {
    context.refs['pv-type-project'].tabIndex = tabIndex;
    tabIndex++;
  }

  if (list.hasOwnProperty('name')) {
    context.refs['pv-container-name']
      .classList.toggle('hidden', !list.name);
  }

  if (list.name) {
    context.refs['pv-input-name'].tabIndex = tabIndex;
    tabIndex++;
  }
  else {
    context.refs['pv-input-name'].tabIndex = -1;
  }

  if (list.hasOwnProperty('sortBy')) {
    context.refs['pv-container-sortBy']
      .classList.toggle('hidden', !list.sortBy);
  }

  if (list.sortBy) {
    let element = context.refs['pv-container-sortBy']
      .querySelector('.pv-select-sortBy');
    if (element) {
      element.tabIndex = tabIndex;
      tabIndex++;
    }
  }
  else {
    let element = context.refs['pv-container-sortBy']
      .querySelector('.pv-select-sortBy');
    if (element) {
      element.tabIndex = -1;
    }
  }

  if (list.hasOwnProperty('icons')) {
    context.refs['pv-container-icons']
      .classList.toggle('hidden', !list.icons);
  }

  if (list.icons) {
    let element = context.refs['pv-container-icons']
      .querySelector('.pv-input-icon');
    if (element) {
      element.tabIndex = tabIndex;
      tabIndex++;
    }
  }
  else {
    let element = context.refs['pv-container-icons']
      .querySelector('.pv-input-icon');
    if (element) {
      element.tabIndex = -1;
    }
  }

  if (list.hasOwnProperty('color')) {
    context.refs['pv-container-color']
      .classList.toggle('hidden', !list.color);
  }

  if (list.color) {
    let element = context.refs['pv-container-color']
      .querySelector('.pv-input-checkbox-color');
    if (element) {
      element.tabIndex = tabIndex;
      tabIndex++;
    }
  }
  else {
    let element = context.refs['pv-container-color']
      .querySelector('.pv-input-checkbox-color');
    if (element) {
      element.tabIndex = -1;
    }
  }

  if (list.hasOwnProperty('options')) {
    context.refs['pv-container-options']
      .classList.toggle('hidden', !list.options);
  }

  if (list.options) {
    let element = context.refs['pv-container-options']
      .querySelector('.pv-input-checkbox-devMode');
    if (element) {
      element.tabIndex = tabIndex;
      tabIndex++;
    }
  }
  else {
    let element = context.refs['pv-container-options']
      .querySelector('.pv-input-checkbox-devMode');
    if (element) {
      element.tabIndex = -1;
    }
  }

  if (list.hasOwnProperty('paths')) {
    context.refs['pv-container-paths']
      .classList.toggle('hidden', !list.paths);
  }

  if (list.paths) {
    let elementPaths = context.refs['pv-container-paths']
      .querySelector('.pv-button-paths');
    if (elementPaths) {
      elementPaths.tabIndex = tabIndex;
      tabIndex++;
    }

    let elementBulk = context.refs['pv-container-paths']
      .querySelector('.pv-input-checkbox-bulk');
    if (elementBulk) {
      elementPaths.tabIndex = tabIndex;
      tabIndex++;
    }
  }
  else {
    let elementPaths = context.refs['pv-container-paths']
      .querySelector('.pv-button-paths');
    if (elementPaths) {
      elementPaths.tabIndex = -1;
    }

    let elementBulk = context.refs['pv-container-paths']
      .querySelector('.pv-input-checkbox-bulk');
    if (elementBulk) {
      elementPaths.tabIndex = -1;
    }
  }

  if (list.hasOwnProperty('groups')) {
    context.refs['pv-container-groups']
      .classList.toggle('hidden', !list.groups);
  }
};

const initialize = function _initialize (model, candidate) {
  map.set(this, {
    model,
    candidate,
    refs: Object.create(null)
  });

  const panelHeading = document.createElement('div');
  const panelBody = document.createElement('div');

  panelHeading.classList.add('panel-head');
  panelBody.classList.add('panel-body');

  actionsContainer.call(this, panelHeading);
  typeContainer.call(this, panelBody);
  nameContainer.call(this, panelBody);
  sortByContainer.call(this, panelBody);
  iconContainer.call(this, panelBody);
  colorContainer.call(this, panelBody);
  optionsContainer.call(this, panelBody);
  pathsContainer.call(this, panelBody);
  configContainer.call(this, panelBody);
  groupsContainer.call(this, panelBody);

  const hasModel = (candidate && candidate.hasOwnProperty('type')) || (!candidate && model);
  const isProject = hasModel && (model && model.type === 'project' || candidate && candidate.type === 'project');
  const isGroup = hasModel && !isProject;

  activateContainers.call(this, {
    name: hasModel,
    sortBy: isGroup,
    icons: hasModel,
    color: hasModel,
    options: isProject,
    paths: isProject,
    groups: hasModel,
    config: isProject
  });

  this.appendChild(panelHeading);
  this.appendChild(panelBody);

  const context = map.get(this);

  if (
    (context.candidate && context.candidate.type === 'group') ||
    (context.model && context.model.type === 'group')
  ) {
    context.refs['pv-type-group'].checked = true;
    clickType.call(this, context, { target: context.refs['pv-type-group'] });
  }
  else {
    context.refs['pv-type-project'].checked = true;
    clickType.call(this, context, { target: context.refs['pv-type-project'] });
  }
};

const clickCancelButton = function _clickCancelButton () {
  closeEditor();
};

const clickDeleteButton = function _clickDeleteButton () {
  const context = map.get(this);
  if (!context || !context.model) { return; }
  const view = getViewFromModel(context.model);
  if (!view) { return; }
  view.remove();
  database.remove(context.model);
  database.save();
  closeEditor();
};

const createModel = function _createModel (type, changes) {
  if (!type) { return false; }

  const model = module.parent.exports[type].createModel(changes);

  const wasAdded = database.addTo(model);
  if (!wasAdded) {
    atom.notifications.addError(`Could not create the new ${type}`, {
      detail: 'it is possible that some of the fields are incorrect',
      icon: 'database'
    });
    return;
  }

  const view = module.parent.exports[type].createView(model);
  const parentGroup = changes.group;

  if (parentGroup) {
    Object.setPrototypeOf(model, parentGroup.model);
    view.initialize();
    view.render();
    parentGroup.view.attachChild(view);
  }
  else {
    const mainView = document.querySelector('project-viewer');
    if (mainView) {
      mainView.attachChild(view);
    }
  }
  return true;
};

const updateModel = function _updateModel (changes) {
  const context = map.get(this);

  if (!context || !context.model) { return; }

  const parentContext = Object.getPrototypeOf(context.model);

  const view = getViewFromModel(context.model);
  const parentView = getViewFromModel(parentContext);

  const currentOpenedProject = getCurrentOpenedProject(context.model);

  Object.assign(context.model, changes);

  if (context.model.type === 'project') {
    context.model.clearPaths();
    context.model.addPaths(changes.paths);
  }

  if (currentOpenedProject) {
    database.pathsChangedBypass = true;
    atom.project.setPaths(changes.paths);
    database.pathsChangedBypass = false;
  }

  const newParentGroup = changes.group;

  if (!newParentGroup || !newParentGroup.view) {
    database.moveTo(context.model);
  }
  else if (newParentGroup && parentView != newParentGroup.view) {
    database.moveTo(context.model, newParentGroup.model);
  }

  database.save();
  view.render();
  closeEditor();
};

const clickSuccessButton = function _clickSuccessButton () {
  const context = map.get(this);
  const type = getType.call(this);

  const changes = {
    name: getName.call(this),
    sortBy: getSelectedSortBy.call(this),
    icon: getSelectedIcon.call(this),
    color: getSelectedColor.call(this),
    paths: getSelectedPaths.call(this),
    group: getSelectedGroup.call(this)
  };

  if (context.model && context.model.uuid) {
    updateModel.call(this, changes);
    return;
  }

  let safeToClose = true;

  if (context.refs['pv-bulk-operation']) {
    context.refs['pv-list-paths'].forEach(function (path) {
      const uniqueChanges = Object.assign(changes, {
        name: nodePath.basename(path),
        paths: [path]
      });
      safeToClose = createModel(type, uniqueChanges);
    });
  }
  else {
    safeToClose = createModel(type, changes);
  }

  if (safeToClose) {
    database.save();
    closeEditor();
  }
};

const clickListItem = function _clickListItem (context, evt) {
  let current = getView(evt.target);
  const selected = context.refs['pv-group-selected'];
  if (selected && current !== selected) {
    selected.classList.remove('selected');
  }
  if (selected === current) {
      context.refs['pv-group-selected'] = undefined;
  }
  else {
    context.refs['pv-group-selected'] = current;
  }
  current.classList.toggle('selected');
};

const clickIconView = function _clickIconView (view) {
  const context = map.get(this);
  const selectedView = context.refs['pv-selected-icon'];
  if (selectedView) {
    selectedView.classList.remove('highlight-success');
  }
  if (selectedView === view) {
    delete context.refs['pv-selected-icon'];
    return;
  }
  view.classList.add('highlight-success');
  context.refs['pv-selected-icon'] = view;
};

const clickToggleColor = function _clickToggleColor (evt) {
  this.refs['pv-color-enabled'] = evt.target.checked;
  this.refs['pv-input-color'].disabled = !this.refs['pv-color-enabled'];
  this.refs['pv-color-palette'].hidden = this.refs['pv-input-color'].disabled;
};

const clickType = function _clickType (_context, evt) {
  if (evt.target.nodeName === 'LABEL') {
    return;
  }
  const context = _context || map.get(this);
  const previous = context.refs['pv-input-type'];
  const current = evt.target;
  if (previous && current !== previous) {
    previous.checked = false;
  }
  context.refs['pv-input-type'] = current;

  const isGroup = getType.call(this) === 'group';
  const isProject = !isGroup;

  activateContainers.call(this, {
    name: true,
    sortBy: isGroup,
    icons: true,
    color: true,
    options: isProject,
    paths: isProject,
    groups: true,
    config: isProject
  });
};

const viewMethods = {
  detachedCallback,
  attachedCallback,
  getTitle,
  initialize
};

const createView = function _createView (model) {
  let options = {
    tagIs: 'project-viewer-editor'
  };
  return domBuilder.createView(options, viewMethods, model);
};

module.exports = {
  createView: createView
};
