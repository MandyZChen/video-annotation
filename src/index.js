/* eslint-disable no-console */
const logger = require('winston');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

const google = require('googleapis');
const youtube = google.youtube('v3');

youtube.playlistItems.list({
  key: 'AIzaSyDEuWUTFbXnQItNJiviwMyg7Ize2_zKCKI',
  part: 'id,snippet',
  playlistId: 'PLm09SE4GxfvWi5dKXkCoXdtJstAgvNHp3',
  maxResult: 10,
}, (err, results) => {
  logger.info(results);
});

server.on('listening', () =>
  logger.info(`Feathers application started on ${app.get('host')}:${port}`)
);