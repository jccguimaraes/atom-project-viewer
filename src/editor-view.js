'use strict';

const CompositeDisposable = require('atom').CompositeDisposable;
const map = require('./map');
const domBuilder = require('./dom-builder');
const buildBlock = require('./common').buildBlock;
const buildHeader = require('./common').buildHeader
const buildInput = require('./common').buildInput
const buildButton = require('./common').buildButton
const buildLabel = require('./common').buildLabel
const octicons = require('./json/octicons.json');
const devicons = require('./json/devicons.json');
const database = require('./database');

const getType = function _getType () {
  const props = map.get(this);
  const selected = props.refs['pv-input-type'];
  if (!selected) { return; }
  return props.refs['pv-input-type'].getAttribute('data-pv-type');
};

const getName = function _getName () {
  const props = map.get(this);
  const view = props.refs['pv-input-name'];
  if (!view) { return; }
  return view.value;
};

const getSelectedSortBy = function _getSelectedSortBy () {
  const props = map.get(this);
  const view = props.refs['pv-select-sortBy'];
  if (!view) { return; }
  const selected = view.selectedOptions[0];
  if (!selected) { return; }
  return selected.value;
};

const getSelectedIcon = function _getSelectedIcon () {
  const props = map.get(this);
  const view = props.refs['pv-selected-icon'];
  if (!view) { return; }
  return view.getAttribute('data-pv-icon');
};

const getSelectedColor = function _getSelectedColor () {
  const props = map.get(this);
  const enabled = props.refs['pv-color-enabled'];
  if (!enabled) { return; }
  const view = props.refs['pv-input-color'];
  if (!view) { return; }
  return view.value;
};

const getSelectedPaths = function _getSelectedPaths () {
  const props = map.get(this);
  return props.refs['pv-list-paths'];
};

const detachedCallback = function _detachedCallback () {
  this.disposables.dispose();
};

const attachedCallback = function _attachedCallback () {
  this.disposables = new CompositeDisposable();
  this.classList.add('native-key-bindings', 'pv-has-icons');
  const props = map.get(this);
  if (props.model) {
    this.setAttribute('data-pv-uuid', props.model.uuid);
  }
};

const getTitle = function _getTitle () {
  let props = map.get(this);
  if (props && props.model) {
    return `PV Editor - ${props.model.name}`;
  }
  return 'PV Editor';
};

const closeEditor = function _closeEditor () {
  atom.workspace.getActivePane().destroyActiveItem();
};

const actionsContainer = function _actionsContainer (parentView) {
  const props = map.get(this);
  const actionsBlock = buildBlock();
  const cancelButton = buildButton('Cancel', 'warning');
  const deleteButton = buildButton('Delete', 'error');
  const successButton = buildButton(props.model ? 'Update' : 'Create', 'success');

  cancelButton.addEventListener('click', clickCancelButton, false);
  deleteButton.addEventListener('click', clickDeleteButton, false);
  successButton.addEventListener('click', clickSuccessButton.bind(this), false);

  actionsBlock.appendChild(cancelButton);
  actionsBlock.appendChild(deleteButton);
  actionsBlock.appendChild(successButton);

  parentView.appendChild(actionsBlock);
};

const typeContainer = function _typeContainer (parentView) {
  const props = map.get(this);

  const typeBlock = buildBlock();
  const typeHeader = buildHeader('Type');
  const typeGroupInput = buildInput('radio', 'type-group');
  const typeProjectInput = buildInput('radio', 'type-project');
  const typeGroupLabel = buildLabel('Group', 'type-group', typeGroupInput);
  const typeProjectLabel = buildLabel('Project', 'type-group', typeProjectInput);

  typeGroupLabel.addEventListener('click', clickType.bind(this, props), false);
  typeProjectLabel.addEventListener('click', clickType.bind(this, props), false);

  typeGroupInput.setAttribute('data-pv-type', 'group');
  typeProjectInput.setAttribute('data-pv-type', 'project');

  typeBlock.appendChild(typeHeader);
  typeBlock.appendChild(typeGroupLabel);
  typeBlock.appendChild(typeProjectLabel);
  parentView.appendChild(typeBlock);
};

const nameContainer = function _setName (parentView) {
  const props = map.get(this);
  const nameBlock = buildBlock();
  const nameHeader = buildHeader('Name');
  const nameInput = buildInput('text', 'name');

  props.refs['pv-container-name'] = nameBlock;
  props.refs['pv-input-name'] = nameInput;

  if (props.model) {
    nameInput.value = props.model.name;
  }

  nameBlock.appendChild(nameHeader);
  nameBlock.appendChild(nameInput);
  parentView.appendChild(nameBlock);
};

const sortByContainer = function _sortByContainer (parentView) {
  const props = map.get(this);
  const sortByBlock = buildBlock();
  const sortByHeader = buildHeader('Sort By');

  props.refs['pv-container-sortBy'] = sortByBlock;

  const sortBySelect = document.createElement('select');
  sortBySelect.classList.add('input-select', 'pv-select-sortBy');
  if (props.refs) {
    props.refs['pv-select-sortBy'] = sortBySelect;
  }

  const sortBy = [
    'alphabetically',
    'position',
    'reverse-alphabetically',
    'reverse-position'
  ];

  sortBy.forEach(
    (sortBy) => {
      const sortByOption = document.createElement('option');
      sortByOption.textContent = sortBy;
      sortBySelect.appendChild(sortByOption);
    }
  );

  sortByBlock.appendChild(sortByHeader);
  sortByBlock.appendChild(sortBySelect);

  parentView.appendChild(sortByBlock);
};

const iconContainer = function _iconContainer (parentView) {
  const props = map.get(this);
  const onlyIcons = atom.config.get('project-viewer.onlyIcons');
  const iconBlock = buildBlock();
  const iconHeader = buildHeader('Icons');
  const iconInput = buildInput('search', 'icon');

  iconInput.addEventListener('keyup', function (evt) {
    const searchPattern = evt.target.value;
    Array.from(iconList.childNodes).forEach(function (iconView) {
      const currentIcon = iconView.getAttribute('data-pv-icon');
      const isMatch = currentIcon.search(searchPattern) !== -1;
      iconView.classList.toggle('hidden', !!searchPattern.length && !isMatch);
    });
  }, false);

  iconInput.addEventListener('search', function (evt) {
    const searchPattern = evt.target.value;
    Array.from(iconList.childNodes).forEach(function (iconView) {
      const currentIcon = iconView.getAttribute('data-pv-icon');
      const isMatch = currentIcon.search(searchPattern) !== -1;
      iconView.classList.toggle('hidden', !!searchPattern.length && !isMatch);
    });
  }, false);

  props.refs['pv-container-icons'] = iconBlock;

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
      iconView.addEventListener('click', clickIconView.bind(this, iconView), false);
      iconList.appendChild(iconView);

      if (props.model && props.model.icon === icon) {
        iconView.classList.add('highlight-success');
        props.refs['pv-selected-icon'] = iconView;
      }
    }
  );

  iconBlock.appendChild(iconHeader);
  iconBlock.appendChild(iconInput);
  iconBlock.appendChild(iconList);

  parentView.appendChild(iconBlock);
};

const colorContainer = function _colorContainer (parentView) {
  const props = map.get(this);

  const colorBlock = buildBlock();
  const colorHeader = buildHeader('Color');
  const colorInput = buildInput('color', 'color');
  const toggleColorInput = buildInput('checkbox', 'checkbox-color');
  const toggleColorLabel = buildLabel('Enable color', 'toggle-color', toggleColorInput);
  const colorPalette = document.createElement('div');
  const colorPaletteText = document.createElement('p');

  props.refs['pv-container-color'] = colorBlock;
  props.refs['pv-color-palette'] = colorPalette;

  toggleColorLabel.classList.add('inliner');
  toggleColorLabel.addEventListener('click', clickToggleColor.bind(props), false);

  colorPaletteText.classList.add('pv-palette-info');
  colorPaletteText.textContent = 'quick picker'
  colorPalette.appendChild(colorPaletteText);
  colorPalette.classList.add('pv-color-palette');
  [
    '#F1E4E8', '#F7B05B', '#595959', '#CD5334', '#EDB88B', '#23282E', '#263655',
    '#F75468', '#FF808F', '#FFDB80', '#292E1E', '#248232', '#2BA84A', '#D8DAD3',
    '#FCFFFC', '#8EA604', '#F5BB00', '#EC9F05', '#FF5722', '#BF3100'
  ].forEach(
    function (color) {
      const palette = document.createElement('div');
      palette.classList.add('pv-palette');
      palette.addEventListener('click', function (evt) {
        if (evt.target.parentNode.hasAttribute('hidden')) { return; }
        colorInput.value = evt.target.getAttribute('data-pv-palette');
      }, false);
      palette.setAttribute('style', `background-color: ${color}`)
      palette.setAttribute('data-pv-palette', color);
      colorPalette.appendChild(palette);
    }
  );

  colorBlock.appendChild(colorHeader);
  colorBlock.appendChild(toggleColorLabel);
  colorBlock.appendChild(colorInput);
  colorBlock.appendChild(colorPalette);

  parentView.appendChild(colorBlock);

  props.refs['pv-input-color'] = colorInput;

  if (props.model) {
    colorInput.value = props.model.color;
    colorInput.disabled = !props.model.color;
    colorPalette.hidden = colorInput.disabled;
    toggleColorInput.checked = !!props.model.color;
  }
  else {
    colorInput.disabled = true;
    colorPalette.hidden = true;
    toggleColorInput.checked = false;
  }

  props.refs['pv-color-enabled'] = toggleColorInput.checked;
};

const optionsContainer = function _optionsContainer (parentView) {
  const props = map.get(this);
  const optionsBlock = buildBlock();
  const optionsHeader = buildHeader('Options');
  const devModeInput = buildInput('checkbox', 'checkbox-devMode');
  const devModeLabel = buildLabel('Open in Dev Mode', 'devMode', devModeInput);

  props.refs['pv-container-options'] = optionsBlock;

  optionsBlock.appendChild(optionsHeader);
  optionsBlock.appendChild(devModeLabel);
  parentView.appendChild(optionsBlock);
};

const pathsContainer = function _pathsContainer (parentView) {
  const props = map.get(this);

  const pathsBlock = buildBlock();
  const pathsHeader = buildHeader('Paths');
  const bulkInput = buildInput('checkbox', 'checkbox-bulk');
  const bulkLabel = buildLabel('Each path is a project', 'bulk', bulkInput);
  const pathsButton = buildButton('Add project folder(s)', 'primary');

  props.refs['pv-list-paths'] = [];

  pathsButton.addEventListener('click', function () {
    atom.pickFolder(function (path) {
      if (props.refs['pv-list-paths'].indexOf(path) !== -1) {
        props.refs['pv-list-paths'] = props.refs['pv-list-paths'].concat(path);
      }
    });
  }, false);

  props.refs['pv-container-paths'] = pathsBlock;

  pathsBlock.classList.add('pv-block-paths');
  bulkLabel.classList.add('inliner');
  pathsButton.classList.add('pv-button-paths');

  let pathsList = document.createElement('ul');
  pathsList.classList.add('list-group');

  pathsBlock.appendChild(pathsHeader);
  pathsBlock.appendChild(pathsButton);

  if (!props.model) {
    pathsBlock.appendChild(bulkLabel);
  }
  pathsBlock.appendChild(pathsList);

  parentView.appendChild(pathsBlock);

  if (!props.model || !Array.isArray(props.model.paths)) { return; }

  props.model.paths.forEach(
    (path) => {
      let listItem = document.createElement('li');
      listItem.classList.add('list-item');
      let listItemSpanRemove = document.createElement('span');
      listItemSpanRemove.classList.add(
        'icon', 'icon-remove-close', 'pv-path-remove', 'text-error'
      );
      let listItemSpan = document.createElement('span');
      listItemSpan.classList.add('pv-path-name', 'text-info');
      listItemSpan.textContent = path;
      props.refs['pv-list-paths'].push(path);
      listItem.appendChild(listItemSpanRemove);
      listItem.appendChild(listItemSpan);
      pathsList.appendChild(listItem);
    }
  )
};

const groupsContainer = function _parentContainer (parentView) {
  const props = map.get(this);
  const groupsBlock = buildBlock();
  const groupsHeader = buildHeader('Groups');

  props.refs['pv-container-groups'] = groupsBlock;

  const listTree = document.createElement('ul');
  listTree.classList.add('list-tree');

  database.fetch().filter((entry) => {
    if (entry.type === 'group') {
      const nestedItem = document.createElement('li');
      nestedItem.classList.add('list-nested-item');
      const listItem = document.createElement('div');
      listItem.classList.add('list-item');
      listItem.setAttribute('data-pv-uuid', entry.uuid);
      listItem.textContent = entry.name;
      listItem.addEventListener('click', function clickListItem () {
        let selected = listTree.querySelector('.selected');
        if (selected) {
          selected.classList.remove('selected');
        }
        if (selected !== nestedItem) {
          nestedItem.classList.add('selected');
        }
      }, false);
      nestedItem.appendChild(listItem);
      const parentModel = Object.getPrototypeOf(entry);
      if (parentModel === Object.prototype) {
        listTree.appendChild(nestedItem);
        return;
      }
      const parentView = listTree.querySelector(
        `[data-pv-uuid="${parentModel.uuid}"]`
      );
      if (!parentView) {
        return;
      }
      let subList = parentView.parentNode.querySelector('ul');
      if (!subList) {
        subList = document.createElement('ul');
        subList.classList.add('list-tree');
        parentView.parentNode.appendChild(subList);
      }
      subList.appendChild(nestedItem);
    }
  });

  groupsBlock.appendChild(groupsHeader);
  groupsBlock.appendChild(listTree);

  parentView.appendChild(groupsBlock);
};

const configContainer = function _configContainer () {};

const activateContainers = function _activateContainer (options) {
  const props = map.get(this);
  props.refs['pv-container-name'].classList.toggle('hidden', !options.name);
  props.refs['pv-container-sortBy'].classList.toggle('hidden', !options.sortBy);
  props.refs['pv-container-icons'].classList.toggle('hidden', !options.icons);
  props.refs['pv-container-color'].classList.toggle('hidden', !options.color);
  props.refs['pv-container-options'].classList.toggle('hidden', !options.options);
  props.refs['pv-container-paths'].classList.toggle('hidden', !options.paths);
  props.refs['pv-container-groups'].classList.toggle('hidden', !options.groups);

};

const initialize = function _initialize (model) {
  const context = map.set(this, {
    model,
    refs: Object.create(null)
  });

  const panelHeading = document.createElement('div');
  const panelBody = document.createElement('div');

  panelHeading.classList.add('panel-head');
  panelBody.classList.add('panel-body');

  actionsContainer.call(this, panelHeading);

  if (!model) {
    typeContainer.call(this, panelBody);
  }

  nameContainer.call(this, panelBody);
  sortByContainer.call(this, panelBody);
  iconContainer.call(this, panelBody);
  colorContainer.call(this, panelBody);
  optionsContainer.call(this, panelBody);
  pathsContainer.call(this, panelBody);
  configContainer.call(this, panelBody);
  groupsContainer.call(this, panelBody);

  const hasModel = !!model;
  const isProject = hasModel && model.type === 'project';
  const isGroup = hasModel && model.type === 'group';

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
};

const clickCancelButton = function _clickCancelButton () {
  closeEditor();
};

const clickDeleteButton = function _clickDeleteButton () {
  closeEditor();
};

const clickSuccessButton = function _clickSuccessButton () {
  const type = getType.call(this);

  if (!type) { return }

  const model = module.parent.exports[type].createModel({
    name: getName.call(this),
    sortBy: getSelectedSortBy.call(this),
    icon: getSelectedIcon.call(this),
    color: getSelectedColor.call(this),
    paths: getSelectedPaths.call(this)
  });

  const wasAdded = database.addTo(model);
  if (!wasAdded) {
    atom.notifications.addError(`Could not create the new ${type}`, {
      detail: 'it is possible that some of the fields are incorrect',
      icon: 'database'
    });
    return;
  }
  database.update();
};

const clickIconView = function _clickIconView (view) {
  const props = map.get(this);
  const selectedView = props.refs['pv-selected-icon'];
  if (selectedView) {
    selectedView.classList.remove('highlight-success');
  }
  if (selectedView === view) {
    delete props.refs['pv-selected-icon'];
    return;
  }
  view.classList.add('highlight-success');
  props.refs['pv-selected-icon'] = view;
};

const clickToggleColor = function _clickToggleColor (evt) {
  this.refs['pv-color-enabled'] = evt.target.checked;
  this.refs['pv-input-color'].disabled = !this.refs['pv-color-enabled'];
  this.refs['pv-color-palette'].hidden = this.refs['pv-input-color'].disabled;
};

const clickType = function _clickType (_props, evt) {
  if (evt.target.nodeName === 'LABEL') {
    return;
  }
  const props = _props || map.get(this);
  const previous = props.refs['pv-input-type'];
  const current = evt.target;
  if (previous && current !== previous) {
    previous.checked = false;
  }
  props.refs['pv-input-type'] = current;

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
