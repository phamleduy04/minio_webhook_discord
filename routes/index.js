const router = require('express').Router();
const webHookURL = process.env.WEBHOOK_URL;
const { request } = require('undici');
const moment = require('moment-timezone');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.status(200).send('Home page!');
});

router.post('/', (req, res) => {
  if (webHookURL) res.status(400).send('Webhook URL not set');
  const { body } = req;
  const fileData = body.Records[0];
  const { eventSource, eventTime, eventName } = fileData;
  const { key, size } = fileData.object;
  request(webHookURL, {
    method: 'POST',
    body: {
      "content": null,
      "embeds": [
        {
          "title": eventName,
          "description": `${key} (${formatBytes(size)}) uploaded to ${eventSource}`,
          "color": 5814783,
          "timestamp": eventTime
        }
      ]
    }
  });
  res.status(200);
});

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = router;