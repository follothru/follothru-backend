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

  CourseSchema.pre('deleteOne', function() {
    const { _conditions } = this;
    deleteSubdocuments(_conditions);
  });

  function deleteSubdocuments(conditions) {
    const CourseModel = mongoose.model('CourseModel');
    const ReminderModel = mongoose.model('ReminderModel');
    return CourseModel.find(conditions)
      .then(courses => courses.map(c => c._id))
      .then(courseIds =>
        ReminderModel.deleteMany({ course: { $in: courseIds } })
      );
  }

  return mongoose.model('CourseModel', CourseSchema);
})();
