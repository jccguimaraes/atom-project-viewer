(function () {
    'use strict';

    const path = require('path'),
        Mocha = require('mocha');

    module.exports = (args) => {

        return new Promise((resolve) => {

            let applicationDelegate;
            let element;

            applicationDelegate = args.buildDefaultApplicationDelegate();

            window.atom = args.buildAtomEnvironment({
                applicationDelegate: applicationDelegate,
                window: window,
                document: document,
                configDirPath: process.env.ATOM_HOME,
                enablePersistence: false
            });

            element = document.createElement('div');
            document.body.appendChild(element);
            element.id = 'mocha';

            let testPath;
            let mocha;

            testPath = path.join(args.testPaths[0], '..', 'spec');

            mocha = new Mocha({
                ui: 'bdd',
                reporter: 'html'
            });

            Mocha.utils.lookupFiles(testPath, ['js'], true)
            .forEach(
                mocha.addFile.bind(mocha)
            );

            mocha.run()
            .on('end', function () {
                let link = document.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('href', path.join(__dirname, '..', 'node_modules/mocha/mocha.css'));
                document.head.appendChild(link);
                document.body.style.overflow = 'scroll';

                resolve(0);
            });
        });
    };
})();
