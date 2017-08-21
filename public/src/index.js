const feathers = require('feathers/client');
const rest = require('feathers-rest/client');
const $ = require("jquery");
const YTPlayer = require('yt-player');
const _ = require('lodash');
const assert = require('assert');
const moment = require('moment');
const util = require('util');
const restClient = rest();
const app = feathers().configure(restClient.jquery($));
const playlist = app.service('/playlist');
const db = app.service('/mongo');

const MAX_TRIALS = 3;

function getPlaylist(id, params) {
  return playlist.get(id, params).then(function(message) {
    console.log(message);
    return message;
  }).catch(function(err) {
    console.error(err);
    throw err;
  });
}

var player = new YTPlayer('#yt-player', {
  width: 800,
  height: 600,
  related: false,
  info: false,
  modestBranding: true,
});

const trialEntries = [];
var user = {
  info: {},
  trials: [],
  trialVideos: [],
  currentTrial: 0,
};

function beginTrial() {
  const currentTrial = user.currentTrial;
  $('#trialNumber').text(currentTrial + 1);
  $('.totalNumber').text(MAX_TRIALS);
  const videoId = _.get(user.trialVideos[currentTrial], 'videoId');
  if (!videoId) {
    window.alert('Could not load video!');
    return;
  }
  player.load(videoId);
  showPage(4);
}

$(document).ready(function() {
  preventNavigation();
  showPage(0);
  $('.totalNumber').text(MAX_TRIALS);
  registerHandlers();
  infoFormHandler();

  getPlaylist('PLm09SE4GxfvWi5dKXkCoXdtJstAgvNHp3', {
    query: {
      maxResults: MAX_TRIALS,
    }
  }).then(message => {
    Array.prototype.push.apply(user.trialVideos, message.results);
  });
});

function registerHandlers() {
  $('#recordStart').click(() => getPlayerTime($('#startInput')));
  $('#recordEnd').click(() => getPlayerTime($('#endInput')));
  $('#action').change(showOtherAction);
  $('#addEntry').click(recordEntry);
  $('#deleteEntry').click(deleteEntry);
  $('#submitTrial').click(submitTrial);
  $('#submitTrial').hide();
  $('#begin').click(beginTrial);
}

function showOtherAction() {
  var actionVal = $('#action option:selected').val();

  if (actionVal === 'other') {
    $('#otherAction').show();
  } else {
    $('#otherAction').hide();
  }

  var actionPrompt;
  switch(actionVal) {
    case 'accelerate':
      actionPrompt = 'The driver is accelerating because'
      break;
    case 'brake':
      actionPrompt = 'The driver is braking because'
      break;
    case 'coast':
      actionPrompt = 'The driver is coasting because'
      break;
    case 'leftTurn':
      actionPrompt = 'The driver is turning left because'
      break;
    case 'rightTurn':
      actionPrompt = 'The driver is turning right because'
      break;
    case 'mergeLeft':
      actionPrompt = 'The driver is merging left because'
      break;
    case 'mergeRight':
      actionPrompt = 'The driver is merging right because'
      break;
    case 'uTurn':
      actionPrompt = 'The driver is making a U turn because'
      break;
    case 'other':
      actionPrompt = 'The driver is ... because'
      break;
  }

  $('#why').val(actionPrompt);
  if (actionVal === 'other'){
    $('#otherAction').val('');
  }else {
    $('#otherAction').val(actionVal);
  }
  
}

function formatPlayerTime(timestamp) {
  var minute = Math.floor(timestamp / 60);
  var seconds = Math.floor(timestamp % 60);
  var milliseconds = (timestamp % 1) * 1000;
  return moment().startOf('day')
          .minutes(minute)
          .seconds(seconds)
          .milliseconds(milliseconds)
          .format('mm:ss.SSS');
}

function getPlayerTime(element) {
  var timestamp = player.getCurrentTime();
  timestamp = formatPlayerTime(timestamp);
  element.val(timestamp);
}

function infoFormHandler() {
  showJustEmail();
  $('#submitForm').click(checkEmail);
}


function recordEntry() {
  var values = $('#entryForm').serializeArray();
  var entry = {};
  
  // Create a entry
  _.each(values, val => {
    entry[val.name] = val.value;
  });

  // End time must be larger than start time
  if (entry.endTime<=entry.startTime){
    window.alert('End time must be later than start time!');
    return;
  } 

  // Alert if not all fields present
  const allPresent = _.every(_.values(entry), e => e.length);
  if (!allPresent) {
    window.alert('Please Fill in All Fields');
    return;
  }

  // Add a summary to history
  var summary = util.format('%s - %s: %s', 
    entry.startTime, entry.endTime, entry.why);
  $('#historyList').append(util.format('<li>%s</li>', summary));

  // Append entry to trialEntries
  trialEntries.push(entry);

  // Empty all entries
  $('#entryBox :input').val('');

  if ($('#historyList').children().length>0){
    $('#submitTrial').show();
  }
}

function deleteEntry(){
  $("#historyList").children().last().remove();
  trialEntries.pop();
}

function submitTrial(){
  user.trials.push(trialEntries);
  user.currentTrial += 1;
  console.warn(user);
  updateEntry(user);

  $('#historyList').empty();
  $('#submitTrial').hide();
  if (user.currentTrial === MAX_TRIALS) {
    showPage(5);
  } else {
    beginTrial();
  }
}


function createUser() {
  // Get all the forms elements and their values in one step
  var values = $("#infoForm").serializeArray();

  if (!user.trialVideos.length) {
    window.alert('Playlist could not be loaded');
    return;
  }

  var allPresent = [];
  _.each(values, function(val) {
    allPresent.push(val.value.length > 0);
    user.info[val.name] = val.value;
  });
  //check if all inputs are present
  allPresent = allPresent.every(function (e) {
    return e;
  });
  if (!allPresent) {
    alert('Please Fill in All Fields');
    return;
  }
  user._id = user.info.email;

  createEntry(user).then(message => {
    if (message) {
      showPage(3);
    }
  });
}

function checkEmail() {
  // Get all the forms elements and their values in one step
  var values = $("#infoForm").serializeArray();
  assert.strictEqual(values[0].name, 'email');
  var email = values[0].value;
  if (!email.match('.+@berkeley\.edu')) {
    // Email does not match berkeley template. Show some warning.
    window.alert('Invalid email. Please enter a berkeley.edu email.');
    return;
  }

  getEntry(email).catch(error => {
    // Email not found, better enter all info
    var alertStr = 'Email not found, please create a new profile.'
    window.alert(alertStr);
    showAllFields();
    $('#submitForm').off('click');
    $('#submitForm').click(createUser);
  }).then(message => {
    // Emails exists, continue?
    if (message) {
      var alertStr = 'Profile exists. Experiment will continue where you left off.'; 
      user = message;
      window.alert(alertStr)
      showPage(3);
    }
  });
}


/**
 * returns a promise
 */
function getEntry(id) {
  return db.get(id).then(function(message) {
    console.log(message);
    return message;
  }).catch(function(err) {
    console.error(err);
    throw err;
  });
}

function updateEntry(entry) {
  return db.update(entry._id, entry)
    .then(function(message) {
      console.log(message);
      return message;
    })
    .catch(function(err) {
      console.error(err);
      throw err;
    });
}

function createEntry(entry) {
  return db.create(entry)
    .then(function(message) {
      console.log(message);
      return message;
    })
    .catch(function(err) {
      console.error(err);
      throw err;
    });
}

function showPage(pageNumber) {
  const pages = $('.page');
  _.forEach(pages, (p, index) => {
    if (index === pageNumber) {
      $(p).show();
    } else {
      $(p).hide();
    }
  });
}

function disableStart(shouldDisable) {
  $('#agreeAndStart').prop('disabled', shouldDisable);
}

function showJustEmail() {
  $('#infoForm .formField#email').siblings().hide();
  $('#formText').hide();
}

function showAllFields() {
  $('#infoForm .formField').show();
  $('#formText').show();
}

function preventNavigation() {
  // Enable navigation prompt
  window.onbeforeunload = function() {
      return true;
  };
}

function findAll() {
  db.find().then(data => console.log(data));
}

module.exports = {
  disableStart: disableStart,
  showPage: showPage,
  createEntry: createEntry,
  findAll: findAll,
  $: $,
  getPlayerTime: getPlayerTime,
  trialEntries: trialEntries,
  user: user,
}