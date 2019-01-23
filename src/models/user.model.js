const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstname: String,
  lastname: String,
  password: String,
  email: String
  // courses: [CourseSchema]
});

module.exports = mongoose.model('UserModel', UserSchema);
