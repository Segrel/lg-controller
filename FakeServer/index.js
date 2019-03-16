const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.text());

app
  .route('/command')
  .all(function (req, res, next) {
    const parts = req.body.split(' ');
    if (3 !== parts.length) {
      return res.send('ka 1 OK1x\n\r');
    }
    req.command = parts[0];
    req.setId = parts[1];
    req.value = parts[2].trim();
    next();
  })
  .post(function ({ command, setId, value }, res) {
    switch (command) {
      case 'ka':
        if ('01' == value) {
          response = `ka ${setId} OK1x`;
        } else {
          response = `ka ${setId} OK0x`;
        }
        break;
      case 'kf':
        if ('ff' == value) {
          response = `kf ${setId} OK11x`;
        } else {
          response = `kf ${setId} OK${value}x`;
        }
        break;
      case 'kd':
        if ('ff' == value) {
          response = `kd ${setId} OK00x`;
        } else {
          response = `kd ${setId} OK${value}x`;
        }
        break;
    }
    return res.send(response + '\n\r');
  });

app.listen(5000);
