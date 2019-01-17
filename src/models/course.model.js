const mongoose = require('mongoose');
const { UserSchema } = require('./user.model.js');

const courseSchema = mongoose.Schema({
  name: String,
  description: String,
  instructors: [UserSchema]
});

module.exports = mongoose.model('CourseModel', courseSchema);
