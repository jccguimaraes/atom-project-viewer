'use strict';

const methods = {
    projectSerialization: function projectSerialization() {
        return atom.project.serialize();
    },
    projectDeserialization: function projectDeserialization(serialization) {
        if (!serialization) {
            return;
        }
        atom.project.deserialize(serialization, atom.deserializers);
    },
    workspaceSerialization: function workspaceSerialization() {
        return atom.workspace.serialize();
    },
    workspaceDeserialization: function workspaceDeserialization(serialization) {
        if (!serialization) {
            return;
        }
        atom.workspace.deserialize(serialization, atom.deserializers);
    },
    treeViewSerialization: function treeViewSerialization() {
        let pkg = atom.packages.getActivePackage('tree-view');

        if (!pkg || !pkg.mainModule || !pkg.mainModule.treeView) {
            return;
        };

        return pkg.mainModule.treeView.serialize();
    },
    treeViewDeserialization: function treeViewDeserialization(serialization) {
        let pkg = atom.packages.getActivePackage('tree-view');

        if (!pkg || !serialization || !serialization.directoryExpansionStates) {
            return;
        }

        if (!pkg || !pkg.mainModule || pkg.mainModule.treeView === null) {
            return;
        }

        if (!pkg.mainModule.treeView) {
            pkg.mainModule.treeView.createView(serialization.directoryExpansionStates);
        } else {
            pkg.mainModule.treeView.updateRoots(serialization.directoryExpansionStates);
        }
    }
};

module.exports = methods;
