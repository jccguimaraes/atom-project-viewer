'use strict';

class TopicElement extends HTMLElement {

    /**
     * Description.
     */
    createdCallback () {}

    /**
     * Description.
     */
    attachedCallback () {
        this.model.onDidChangeTopic(this.setTopic.bind(this));
        this.setTopic(this.model.getTopic());
    }

    /**
     * Description.
     */
    detachedCallback () {}

    initialize (model) {
        if (!model) {
            return;
        }
        this.model = model;

        return this;
    }

    setTopic (topic) {
        this.textContent = topic;
    }
}

module.exports = document.registerElement(
    'pv-topic',
    {
        prototype: TopicElement.prototype
    }
);
