module.exports = (() => {
  const mongoose = require('mongoose');

  const ActivitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    startDateTime: Date,
    endDateTime: Date,
    repeats: [String],
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseModel' },
    reminders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReminderModel' }]
  });

  return mongoose.model('ActivityModel', ActivitySchema);
})();
