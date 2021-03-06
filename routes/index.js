const router = require('express').Router();
require('dotenv').config();
const webHookURL = process.env.WEBHOOK_URL;
const { request } = require('undici');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.status(200).send('Home page!');
});

router.post('/', (req, res) => {
  if (!webHookURL) return res.status(400).send('Webhook URL not set');
  const { body } = req;
  const fileData = body.Records[0];
  const { eventSource, eventTime, eventName, s3 } = fileData;
  const { key, size } = s3.object;
  const requestBody = {
    "content": null,
    "embeds": [
      {
        "title": eventName,
        "description": `${key} (${formatBytes(size)}) uploaded to ${eventSource}`,
        "color": 5814783,
        "timestamp": eventTime
      }
    ]
  };

  request(webHookURL, {
    method: 'POST',
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(requestBody),
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