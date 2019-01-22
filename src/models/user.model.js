const mongoose = require('mongoose');
const { CourseSchema } = require('./course.model.js');

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstname: String,
  lastname: String,
  password: String,
  email: String
  // courses: [CourseSchema]
});

const UserModel = mongoose.model('UserModel', UserSchema);

module.exports = { UserModel, UserSchema };
