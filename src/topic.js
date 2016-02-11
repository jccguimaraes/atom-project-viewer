'use strict';

const CompositeDisposable = require('atom').CompositeDisposable,
    Emitter = require('atom').Emitter;

class Topic {
    constructor (candidate) {
        this.disposables = new CompositeDisposable();
        this.disposables.add(
            atom.views.addViewProvider({
                modelConstructor: Topic,
                viewConstructor: require('./topic-element')
            })
        );
        this.emitter = new Emitter();

        if (!candidate) {
            return;
        }
        this.setTopic(candidate);
    }

    setTopic (topic) {
        if (!topic || typeof topic !== 'string') {
            return;
        }

        this.topic = topic;
        this.emitter.emit(
            'on-did-change-topic',
            this.getTopic()
        );
    }

    getTopic () {
        return this.topic;
    }

    onDidChangeTopic (callback) {
        this.emitter.on(
            'on-did-change-topic',
            callback
        );
    }
}

module.exports = Topic;
