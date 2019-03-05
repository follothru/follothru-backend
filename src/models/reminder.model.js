module.exports = (() => {
  const mongoose = require('mongoose');

  const ReminderSchema = mongoose.Schema({
    name: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseModel' },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivityModel'
      }
    ],
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventModel'
      }
    ]
  });

  return mongoose.model('ReminderModel', ReminderSchema);
})();
