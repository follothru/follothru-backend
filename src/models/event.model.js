module.exports = (() => {
  const mongoose = require('mongoose');

  const EventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    type: { type: String, default: 'event' },
    dateTime: Date,
    subreminders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubreminderModel'
      }
    ]
  });

  return mongoose.model('EventModel', EventSchema);
})();
