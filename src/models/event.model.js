module.exports = (() => {
  const mongoose = require('mongoose');

  const EventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    date: Date,
    reminders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReminderModel' }]
  });

  return mongoose.model('EventModel', EventSchema);
})();
