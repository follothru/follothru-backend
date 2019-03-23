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

  EventSchema.pre('deleteMany', function() {
    const { _conditions } = this;
    return deleteSubdocumenets(_conditions);
  });

  function deleteSubdocumenets(conditions) {
    const EventModel = mongoose.model('EventModel');
    const SubreminderModel = mongoose.model('SubreminderModel');
    return EventModel.find(conditions)
      .then(events =>
        events.reduce((prev, curr) => prev.concat(curr.subreminders), [])
      )
      .then(subreminders => subreminders.map(s => s._id))
      .then(subreminderIds =>
        SubreminderModel.deleteMany({ _id: { $in: subreminderIds } })
      );
  }

  return mongoose.model('EventModel', EventSchema);
})();
