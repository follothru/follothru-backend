module.exports = () => {
  const mongoose = require('mongoose');

  const StudentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    prefName: String,
    email: String,
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourseModel' }]
  });

  return mongoose.model('StudentModel', StudentSchema);
};
