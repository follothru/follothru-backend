const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const {
  ReminderApi,
  CourseApi,
  UserApi,
  SessionApi,
  StudentApi,
  EventApi,
  SubreminderApi
} = require('./apis');
const {
  port,
  mongodbUrl,
  prod,
  mongodbCloudUrl
} = require('./configs/config.js');
const app = express();

if (prod) {
  mongoose.connect(mongodbCloudUrl, { useNewUrlParser: true });
} else {
  mongoose.connect(mongodbUrl, { useNewUrlParser: true });
}

app.use(bodyParser.json());

/**
 * For development purposes only
 */
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});
app.use('/reminder', ReminderApi);
app.use('/course', CourseApi);
app.use('/user', UserApi);
app.use('/session', SessionApi);
app.use('/student', StudentApi);
app.use('/event', EventApi);
app.use('/subreminder', SubreminderApi);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
