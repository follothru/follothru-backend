module.exports = (() => {
  const mongoose = require('mongoose');

  const ReminderActionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dateTime: Date
  });

  return mongoose.model('ReminderActionModel', ReminderActionSchema);
})();
