'use strict';

function f_openModal (item, visible) {
    if (!item) {
        return;
    }

    atom.workspace.addModalPanel({
        item: item,
        visible: visible || true
    });
}

function f_closeModal (panel) {
    if (!panel) {
        return;
    }

    atom.workspace.panelForItem(panel).destroy();
}

const native = {
    openModal: f_openModal,
    closeModal: f_closeModal
};

module.exports = native;
