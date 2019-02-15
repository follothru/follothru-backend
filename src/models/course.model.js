module.exports = (() => {
  const mongoose = require('mongoose');

  const CourseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    endDate: Date,
    active: Boolean,
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentModel' }],
    reminders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReminderModel' }]
  });

  return mongoose.model('CourseModel', CourseSchema);
})();
