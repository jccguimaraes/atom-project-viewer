'use strict';

const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const allowUnsafeEval = require('loophole').allowUnsafeEval;
const allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction;

module.exports = function (args) {

    allowUnsafeEval(() => {
        return allowUnsafeNewFunction(() => {

            document.body.style.overflowY = 'scroll';
            let element = document.createElement('div');
            element.id = 'mocha';
            document.body.appendChild(element);

            let fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", path.join(__dirname, 'node_modules/mocha/mocha.css'));
            document.getElementsByTagName("head")[0].appendChild(fileref);

            let applicationDelegate = args.buildDefaultApplicationDelegate();

            // Build atom global
            window.atom = args.buildAtomEnvironment({
                applicationDelegate: applicationDelegate,
                window: window,
                document: document,
                configDirPath: process.env.ATOM_HOME,
                enablePersistence: false
            });

            const mocha = new Mocha;
            mocha.reporter('html');
            mocha.ui('bdd');
            mocha.suite.emit('pre-require', window, null, mocha);

            let testDir = path.join(__dirname, 'spec');

            // Add each .js file to the mocha instance
            fs.readdirSync(path.join(testDir, 'unit')).filter(function(file){
                // Only keep the .js files
                return file.substr(-8) === '-spec.js';

            }).forEach(function(file){
                mocha.addFile(
                    path.join(testDir, 'unit', file)
                );
            });

            // fs.readdirSync(path.join(testDir, 'functional')).filter(function(file){
            //     // Only keep the .js files
            //     return file.substr(-8) === '-spec.js';
            //
            // }).forEach(function(file){
            //     mocha.addFile(
            //         path.join(testDir, 'functional', file)
            //     );
            // });

            // mocha.checkLeaks();
            // Run the tests.
            mocha.run((failures, a) => {
                process.on('exit', () => {
                    process.exit(failures);
                });
            });
        });
    });

    // success
    return Promise.resolve(0);
};
