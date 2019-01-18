const mongoose = require('mongoose');
const CourseModel = require('./course.model.js');

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  courses: [CourseModel]
});

const UserModel = mongoose.model('UserModel', UserSchema);

module.exports = { UserModel, UserSchema };
