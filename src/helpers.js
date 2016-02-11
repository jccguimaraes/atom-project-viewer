'use strict';

const Path = require('path'),
    Fs = require('fs'),
    EventEmitter = require('events'),
    json = Path.join(atom.styles.configDirPath, 'project-viewer2.json');

class Helpers {

    static readDB () {
        return new Promise((resolve, reject) => {
            Fs.readFile(json, 'utf8', function (err, data) {
                let db;

                if (err) {
                    reject(err);
                }
                try {
                    db = JSON.parse(data);
                } catch (error) {
                    reject(error);
                }
                resolve(db);
            });
        });
    }

    static watcher () {
        let emitter = new EventEmitter();
        let watcher = Fs.watch(json, (event) => {
            if (event === 'change') {
                this.readDB()
                    .then(function (data) {
                        emitter.emit('on-did-change-data', data);
                    })
                    .catch(function (error) {
                        emitter.emit('error', error);
                    });
            }
        });

        watcher.on('error', function () {
            watcher.close();
        });

        return emitter;
    }

    static getStyles () {
        let sourcePath = Path.join(
            atom.styles.configDirPath,
            'packages',
            'project-viewer2',
            'styles',
            'project-viewer.less'
        );

        //atom.packages.getLoadedPackage('project-viewer').stylesheets[0][0]

        let styles = document.querySelector('atom-styles').querySelectorAll('style');
        let projectStyle;
        for (let style in styles) {
            let ss = styles[style];
            if (ss.getAttribute && ss.getAttribute('source-path') === sourcePath)  {
                projectStyle = ss;
            }
        }
        return projectStyle;
    }

    static setGroupRule (rule) {
        let stylesheet = this.getStyles();

        rule = `
            li[is="pv-group"].list-nested-item .list-item span,
            li[is="pv-group"].list-nested-item .list-item::before {
                // color: #D86666;
            }
        `;

        stylesheet.sheet.insertRule(rule, stylesheet.sheet.cssRules.length);
        // stylesheet.sheet.removeRule(stylesheet.sheet.cssRules.length - 1);
    }

    /**
     * Sorts by a give this.sorter
     * @public
     * @param {string} vc - The current value to evaluate.
     * @param {string} vn - The next value to evaluate.
     * @return {number} returns -1, 1 or 0 as defined by the native Array.prototype.sort
     */
    static sortBy (vc, vn) {

        if (!vc || !vn || !this.sorter) {
            return;
        }

        let result;
        let prop = 'get' + (
            this.sorter.charAt(0).toUpperCase()
            + this.sorter.slice(1)
        );

        if (typeof vc[prop] !== 'function' || typeof vn[prop] !== 'function') {
            return;
        }

        if (vc[prop]() > vn[prop]()) {
            result = 1;
        } else if (vc[prop]() < vn[prop]()) {
            result = -1;
        } else {
            result = 0;
        }

        return this.reverse ? -result : result;
    }
}

module.exports = Helpers;
