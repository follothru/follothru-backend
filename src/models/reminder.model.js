module.exports = (() => {
  const mongoose = require('mongoose');

  const ReminderSchema = mongoose.Schema({
    name: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseModel' },
    email: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailModel' },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivityModel'
      }
    ],
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventModel'
      }
    ]
  });

  ReminderSchema.pre('deleteOne', function() {
    const { _conditions } = this;
    return deleteSubdocuments(_conditions);
  });

  ReminderSchema.pre('deleteMany', function() {
    const { _conditions } = this;
    return deleteSubdocuments(_conditions);
  });

  function deleteSubdocuments(conditions) {
    const ReminderModel = mongoose.model('ReminderModel');
    const EventModel = mongoose.model('EventModel');
    const ActivityModel = mongoose.model('ActivityModel');

    const findPromise = ReminderModel.find(conditions);
    return Promise.all([
      findPromise
        .then(reminders =>
          reminders.reduce((prev, curr) => prev.concat(curr.events), [])
        )
        .then(events => EventModel.deleteMany({ _id: { $in: events } })),
      findPromise
        .then(reminders =>
          reminders.reduce((prev, curr) => prev.concat(curr.activities), [])
        )
        .then(activities =>
          ActivityModel.deleteMany({ _id: { $in: activities } })
        )
    ]);
  }

  return mongoose.model('ReminderModel', ReminderSchema);
})();
