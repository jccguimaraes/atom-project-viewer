const showPackage = function _showPackage (name, pkg) {
    if (name === 'tree-view') {
        pkg.mainModule.treeView.show();
    }
};

/**
 * Enables / activates a list of packages
 *
 * @param {Array} list an array of strings with all the packages name
 * @returns {void}
 */
const enablePackages = function _enablePackages (list) {
  list.forEach(pkg => {
    if (!pkg || pkg.trim().length === 0) { return; }
    const enabledPackage = atom.packages.enablePackage(pkg);
    showPackage(pkg, enabledPackage);
  });
};

const disablePackages = function _disablePackages (list) {
  list.forEach(pkg => {
    if (!pkg || pkg.trim().length === 0) { return; }
    atom.packages.disablePackage(pkg);
  });
};

const getTreeViewState = function _getTreeViewState () {
  const treeView = atom.packages.getActivePackage('tree-view');
  if (!treeView || !treeView.mainModule || !treeView.mainModule.treeView) {
    return {};
  }
  return treeView.mainModule.treeView.serialize();
};

const setTreeViewState = function _setTreeViewState (state) {
  if (!state) { return; }
  const pkg = atom.packages.getActivePackage('tree-view');
  if (!pkg || !pkg.mainModule || !pkg.mainModule.treeView) {
    return;
  }

  if (!pkg.mainModule.treeView) {
    pkg.mainModule.createView(state.directoryExpansionStates);
  } else {
    pkg.mainModule.treeView.updateRoots(state.directoryExpansionStates);
  }

  const element = pkg.mainModule.treeView.element;

  if (state.width > 0) {
    element.style.width = `${state.width}px`;
  }

  element.scrollTop = state.scrollTop;
  element.scrollLeft = state.scrollLeft;
}

module.exports = {
  treeView: {
    getState: getTreeViewState,
    setState: setTreeViewState
  },
  state: {
    enable: enablePackages,
    disable: disablePackages
  }
};
