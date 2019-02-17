module.exports = (() => {
  const mongoose = require('mongoose');

  const RepeatMode = {
    EVERYDAY: 'EVERY 1 DAY',
    MONDAY: 'MONDAY',
    TUESDAY: 'TUESDAY',
    WEDNESSDAY: 'WEDNESSDAY',
    THURSDAY: 'THURSDAY',
    FRIDAY: 'FRIDAY',
    SATURDAY: 'SATURDAY'
  };

  const ReminderSchema = mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'EventModel' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseModel' },
    repeats: [String],
    alerts: []
  });

  ReminderSchema.virtual('RepeatMode').get(() => RepeatMode);

  return mongoose.model('ReminderModel', ReminderSchema);
})();
