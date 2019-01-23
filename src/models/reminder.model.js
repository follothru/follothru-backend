const mongoose = require('mongoose');

const ReminderSchema = mongoose.Schema({
  name: String,
  remindDate: Date
});

module.exports = mongoose.model('ReminderModel', ReminderSchema);
