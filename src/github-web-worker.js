const setNamePlaceholder = '{set-name}';
const api = {
  token: undefined,
  gistId: undefined,
  setName: 'default',
  gistFilePattern: 'project-viewer-' + setNamePlaceholder + '.json',
  get gistFileName() {
    return this.gistFilePattern.replace(setNamePlaceholder, this.setName);
  },
  url: 'https://api.github.com/gists',
  gistDescription: 'atom.io project-viewer backup files',
  checkToken: function checkToken() {
    const promise = new Promise((resolve, reject) => {

      // check if github access token is configured
      if (!this.token) {
        reject({
          type: 'warning',
          message: 'No <strong>Github Access Token</strong> was provided, please check the configuration.',
          options: {
            icon: 'mark-github'
          }
        });
        return;
      }
      resolve();
    });

    return promise;
  },
  checkGistId: function checkGistId() {
    const promise = new Promise((resolve, reject) => {

      // check if gist id is configured
      if (!this.gistId) {
        reject({
          type: 'warning',
          message: 'No <strong>Gist ID</strong> was provided, please check the configuration.',
          options: {
            icon: 'mark-github'
          }
        });
        return;
      }

      resolve();
    });

    return promise;
  },
  getGist: function getGist() {
    const promise = new Promise((resolve, reject) => {
      let url = this.url + '/' + this.gistId;

      let headers = new Headers();
      headers.append('Accept', 'application/vnd.github.v3+json');
      headers.append('Authorization', 'token ' + this.token);

      let parameters = {
        method: 'GET',
        headers: headers
      };

      fetch(url, parameters)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (!data || !data.files || !data.files.hasOwnProperty(this.gistFileName)) {
            // backup not found, either gist with given ID doesnt exist (user hasnt created the gist yet or it has been deleted) or user has no existing backup
            reject({
              type: 'warning',
              message: 'No backup found under gist ID [' + this.gistId + '] for set [' + this.setName + ']. Make sure that gist with given ID exists under your private gists and that you have an existing backup (call backup -> call import).',
              options: {
                icon: 'mark-github',
                dismissable: true
              }
            });
            return;
          }

          // backup found, returning
          resolve({
            type: 'success',
            message: 'Retrieved DB from <strong>GitHub</strong> successfully.',
            db: JSON.parse(data.files[this.gistFileName].content),
            options: {
              icon: 'mark-github'
            }
          });
        });
    });

    return promise;
  },
  updateGist: function updateGist(value) {
    const promise = new Promise((resolve, reject) => {

      // common headers
      let headers = new Headers();
      headers.append('Accept', 'application/vnd.github.v3+json');
      headers.append('Authorization', 'token ' + this.token);

      if (this.gistId) {
        // user provided gist id, check if gist exists (if yes update, otherwise reject)
        let url = this.url + '/' + this.gistId;

        let parameters = {
          method: 'GET',
          headers: headers,
        };

        fetch(url, parameters)
          .then((response) => {
            // if OK gist exists
            if (response.ok) {
              // update gist
              let files = {};
              files[this.gistFileName] = {
                content: JSON.stringify(value)
              };

              let body = JSON.stringify({
                description: this.gistDescription,
                public: false,
                files: files
              });

              parameters = {
                method: 'PATCH',
                headers: headers,
                body: body
              };

              fetch(url, parameters)
                .then((response) => {
                  if (response.ok) {
                    // gist successfully updated
                    resolve({
                      type: 'success',
                      message: 'Successfully backed up the DB.',
                      options: {
                        icon: 'mark-github'
                      }
                    });
                    return;
                  }

                  reject({
                    type: 'warning',
                    message: 'Failed to update gist.',
                    options: {
                      icon: 'mark-github'
                    }
                  });
                  return;
                });
            } else {
              // non-OK response from GET on /gists/{gistId} -> gist with user provided gist id doesnt exist
              reject({
                type: 'warning',
                message: 'No gist found with ID [' + this.gistId + ']. Specify valid gist ID or specify empty gist ID and we will create a gist for you.',
                options: {
                  icon: 'mark-github',
                  dismissable: true
                }
              });
              return;
            }
          });
      } else {
        // user didnt specify gist id, create gist for him and set it in config
        let files = {};
        files[this.gistFileName] = {
          content: JSON.stringify(value)
        };

        let body = JSON.stringify({
          description: this.gistDescription,
          public: false,
          files: files
        });

        let parameters = {
          method: 'POST',
          headers: headers,
          body: body
        };

        fetch(this.url, parameters)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data && data.id) {
              // gist successfully created
              this.gistId = data.id;

              resolve({
                type: 'success',
                message: 'Successfully created gist ID [' + data.id + '] and backed up the DB.',
                options: {
                  icon: 'mark-github'
                },
                gistId: data.id
              });
              return;
            }

            reject({
              type: 'warning',
              message: 'Failed to create gist.',
              options: {
                icon: 'mark-github'
              }
            });
            return;
          });
      }
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

  if (e.data[0].hasOwnProperty('gistId')) {
    api.gistId = e.data[0].gistId;
  }

  if (e.data[0].hasOwnProperty('setName')) {
    api.setName = e.data[0].setName;
  }

  if (e.data[0].action === 'fetch') {
    Promise.all([api.checkToken(), api.checkGistId()])
      .then(() => {
        api.getGist()
          .then(postMessage)
          .catch(postMessage);
      })
      .catch(postMessage);
  } else if (e.data[0].action === 'update') {
    Promise.all([api.checkToken()])
      .then(() => {
        api.updateGist(e.data[0].value)
          .then(postMessage)
          .catch(postMessage);
      })
      .catch(postMessage);
  }
}
