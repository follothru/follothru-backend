const mongoose = require('mongoose');
const { UserSchema } = require('./user.model.js');

const CourseSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }]
});

const CourseModel = mongoose.model('CourseModel', CourseSchema);

module.exports = { CourseModel, CourseSchema };
