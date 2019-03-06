module.exports = (() => {
  const mongoose = require('mongoose');

  const CourseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    endDate: Date,
    approved: Boolean,
    hasPlanningPrompt: Boolean,
    planningPrompt: String,
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentModel' }]
  });

  return mongoose.model('CourseModel', CourseSchema);
})();
