const feathers = require('feathers/client');
const rest = require('feathers-rest/client');
const service = require('feathers-nedb');
const $ = require("jquery");
const YTPlayer = require('yt-player');
const _ = require('lodash');

const restClient = rest();
const app = feathers().configure(restClient.jquery($));

const db = app.service('/db');

const player = new YTPlayer('#yt-player');
player.load('wet833J5OYU');


function showPage(pageNumber) {
  const pages = $('.page');
  console.warn(pages);
  _.forEach(pages, (p, index) => {
    if (index === pageNumber) {
      $(p).show();
    } else {
      $(p).hide();
    }
  });
}

function disableStart(shouldDisable) {
  console('something');
}


function createEntry(entry) {
  db.create(entry)
    .then(data => console.log(data))
    .catch(err => console.error(err));
}

function findAll() {
  db.find().then(data => console.log(data));
}

module.exports = {
  disableStart: disableStart,
  showPage: showPage,
  createEntry: createEntry,
  findAll: findAll,
}

