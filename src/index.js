const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const {
  ReminderApi,
  CourseApi,
  UserApi,
  StudentApi,
  EventApi
} = require('./apis');
const { port, mongodbUrl, isProdEnabled, mongodbCloudUrl } = require('./configs/config.js');
const app = express();

if (isProdEnabled) {
  mongoose.connect(mongodbCloudUrl, { useNewUrlParser: true });
} else {
  mongoose.connect(mongodbUrl, { useNewUrlParser: true });
}


app.use(bodyParser.json());

app.use('/reminder', ReminderApi);
app.use('/course', CourseApi);
app.use('/user', UserApi);
app.use('/student', StudentApi);
app.use('/event', EventApi);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
