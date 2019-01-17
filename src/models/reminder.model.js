const mongoose = require('mongoose');

const ReminderSchema = mongoose.Schema({
  name: String,
  remindDate: Date
});

const ReminderModel = mongoose.model('ReminderModel', ReminderSchema);

module.exports = { ReminderModel, ReminderSchema };
