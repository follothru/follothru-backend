const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { ReminderApi } = require('./apis');
const app = express();
const port = 3000;

mongoose.connect(
  'mongodb://mongo:27017/follothru',
  { useNewUrlParser: true }
);

app.use(bodyParser.json());

app.use('/reminder', ReminderApi);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  const CourseModel = require('./models/course.model.js');
  CourseModel.find()
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => {
      console.error(err);
      res.send(err);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
