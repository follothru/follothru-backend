module.exports = (() => {
  const mongoose = require('mongoose');

  const ActivitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    type: { type: String, default: 'activity' },
    dateTime: Date,
    subreminders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubreminderModel'
      }
    ]
  });

  return mongoose.model('ActivityModel', ActivitySchema);
})();
