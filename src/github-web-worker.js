const api = {
    token: undefined,
    gistId: undefined,
    url: 'https://api.github.com/gists',
    setPrivateGist: function setPrivateGist() {
        const promise = new Promise((resolve, reject) => {
            let headers = new Headers();
            let parameters = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    description: 'atom-project-viewer db file',
                    public: false,
                    files: {
                        'project-viewer.json': {
                            content: JSON.stringify({
                                clients: [],
                                groups: [],
                                projects: []
                            })
                        }
                    }
                })
            };

            if (!this.token) {
                reject({
                    type: 'warning',
                    message: 'no token'
                });
                return;
            }

            headers.append("Accept", "application/vnd.github.v3+json");
            headers.append("Authorization", "token " + this.token);

            fetch(this.url, parameters)
            .then(function(response) {
                return response.json();
            })
            .then((data) => {
                if (!data || !data.id) {
                    reject({
                        type: 'warning',
                        message: 'no gist was created'
                    });
                    return;
                }

                this.gistId = data.id;

                resolve({
                    type: 'success',
                    message: 'a new gist was created'
                });
            });
        });
        return promise;
    },
    updatePrivateGist: function updatePrivateGist(value) {
        const promise = new Promise((resolve, reject) => {
            let body = JSON.stringify({
                description: 'atom-project-viewer db file',
                public: false,
                files: {
                    'project-viewer.json': {
                        content: JSON.stringify(value)
                    }
                }
            });
            let headers = new Headers();
            let url;
            let parameters = {
                method: 'PATCH',
                headers: headers,
                body: body
            };

            if (!this.token || !this.gistId) {
                reject({
                    type: 'warning',
                    message: 'no token or gist id'
                });
                return;
            }

            headers.append("Accept", "application/vnd.github.v3+json");
            headers.append("Authorization", "token " + this.token);

            url = this.url + '/' + this.gistId;

            fetch(url, parameters)
            .then(function(response) {
                return response.json();
            })
            .then((data) => {
                if (!data || !data.id) {
                    reject({
                        type: 'info',
                        message: 'no gist found'
                    });
                    return;
                }

                this.gistId = data.id;

                resolve({
                    type: 'success',
                    message: 'Successfully backedup the DB'
                });
            });
        });
        return promise;
    },
    getPrivateGist: function getPrivateGist() {
        const promise = new Promise((resolve, reject) => {
            let headers = new Headers();
            let url;
            let parameters = {
                method: 'GET',
                headers: headers
            };

            if (!this.token || !this.gistId) {
                reject('no token or gist id');
                return;
            }

            url = this.url + '/' + this.gistId;

            headers.append("Accept", "application/vnd.github.v3+json");
            headers.append("Authorization", "token " + this.token);

            fetch(url, parameters)
            .then(function(response) {
                return response.json();
            })
            .then((data) => {
                if (!data || !data.files || !data.files.hasOwnProperty('project-viewer.json')) {
                    reject({
                        type: 'warning',
                        message: 'no gist found with id ' + this.gistId
                    });
                    return;
                }

                resolve({
                    type: 'success',
                    message: 'Retrieved DB from GitHub successfully',
                    db: JSON.parse(data.files['project-viewer.json'].content)
                });
            });
        });
        return promise;
    },
    checkForGist: function checkForGist() {
        const promise = new Promise((resolve, reject) => {

            let headers = new Headers();

            if (!this.token) {
                reject('no token');
                return;
            }

            headers.append("Accept", "application/vnd.github.v3+json");
            headers.append("Authorization", "token " + this.token);

            let parameters = {
                method: 'GET',
                headers: headers
            };

            fetch(this.url, parameters)
            .then(function(response) {
                return response.json();
            })
            .then((data) => {
                if (!data || data.length === 0) {
                    this.setPrivateGist().then(resolve).catch(reject);
                } else {
                    let hasGist = data.some((gist) => {
                        let validation = gist.files.hasOwnProperty('project-viewer.json');
                        if (validation) {
                            this.gistId = gist.id
                        }
                        return validation;
                    });

                    if (hasGist) {
                        this.getPrivateGist().then(resolve).catch(reject);
                    } else {
                        this.setPrivateGist().then(resolve).catch(reject);
                    }
                }
            });
        });
        return promise;
    }
};

onmessage = function(e) {
    if (!e.data || e.data.length === 0) {
        return;
    }

    if (e.data[0].hasOwnProperty('token')) {
        api.token = e.data[0].token;
    }

    if (e.data[0].action === 'fetch') {
        api.checkForGist()
        .then(postMessage)
        .catch(postMessage);
    }
    else if (e.data[0].action === 'update') {
        api.checkForGist()
        .then(() => {
            api.updatePrivateGist(e.data[0].value)
            .then(postMessage)
            .catch(postMessage);
        });
    }


}
