const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { ReminderApi, CourseApi, UserApi } = require('./apis');
const { port, mongodbUrl } = require('./configs/config.js');
const app = express();

mongoose.connect(
  mongodbUrl,
  { useNewUrlParser: true }
);

app.use(bodyParser.json());

app.use('/reminder', ReminderApi);

app.use('/course', CourseApi);

app.use('/user', UserApi);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
