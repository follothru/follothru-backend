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
    actions: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'ReminderActionModel' }
    ],
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseModel' }
  });

  ReminderSchema.virtual('RepeatMode').get(() => RepeatMode);

  return mongoose.model('ReminderModel', ReminderSchema);
})();
