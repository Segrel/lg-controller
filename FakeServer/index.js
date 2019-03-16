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
    setTimeout(() => next(), 500);
  })
  .post(function ({ command, setId, value }, res) {
    switch (command) {
      case 'ka':
        if ('01' == value) {
          response = `a ${setId} OK1x`;
        } else {
          response = `a ${setId} OK0x`;
        }
        break;
      case 'kf':
        if ('ff' == value) {
          response = `f ${setId} OK11x`;
        } else {
          response = `f ${setId} OK${value}x`;
        }
        break;
      case 'kd':
        if ('ff' == value) {
          response = `d ${setId} OK00x`;
        } else {
          response = `d ${setId} OK${value}x`;
        }
        break;
      case 'ke':
        if ('ff' == value) {
          response = `e ${setId} OK00x`
        } else {
          response = `e ${setId} OK${value}x`;
        }
    }
    return res.send(response + '\n\r');
  });

app.listen(5000);
