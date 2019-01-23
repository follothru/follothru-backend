const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }]
});

module.exports = mongoose.model('CourseModel', CourseSchema);
