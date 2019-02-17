const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const {
  ReminderApi,
  CourseApi,
  UserApi,
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
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use('/reminder', ReminderApi);
app.use('/course', CourseApi);
app.use('/user', UserApi);
app.use('/student', StudentApi);
app.use('/event', EventApi);
app.use('/subreminder', SubreminderApi);

/**
 * For development purposes
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
