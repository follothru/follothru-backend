module.exports = (() => {
  const mongoose = require('mongoose');

  const SubreminderSchema = mongoose.Schema({
    parentReminder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReminderModel'
    },
    startDate: Date,
    endDate: Date
  });

  return mongoose.model('SubreminderModel', SubreminderSchema);
})();
