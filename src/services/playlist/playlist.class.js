/* eslint-disable no-unused-vars */
const google = require('googleapis');
const youtube = google.youtube('v3');
const _ = require('lodash');

class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    return Promise.resolve([]);
  }

  get (id, params) {
    params = params.query;
    var videos = [];
    const self = this;
    return new Promise(function(resolve, reject) {
      function getPlaylist(pageToken) {
        console.warn(self.options.apiKey);
        youtube.playlistItems.list({
          key: self.options.apiKey,
          part: 'id,snippet',
          playlistId: id,
          maxResults: 50,
          pageToken: pageToken,
        }, (err, results) => {
          if (err) {
            reject(err);
          } else {
            videos = videos.concat(results.items);
            if (results.nextPageToken) {
              getPlaylist(results.nextPageToken);
            } else {
              const samples = _.sampleSize(videos, params.maxResults);
              const results = _.map(samples, sample => {
                return {videoId: sample.snippet.resourceId.videoId, title: sample.snippet.title};
              });
              resolve({
                id, 
                results: results,
              });
            }
          }
        });
      }

      getPlaylist();
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
