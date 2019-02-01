module.exports = (() => {
  const mongoose = require('mongoose');

  const SubreminderSchema = mongoose.Schema({
    date: Date,
    parentReminder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReminderModel'
    }
  });

  return mongoose.model('SubreminderModel', SubreminderSchema);
})();
