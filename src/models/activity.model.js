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

  ActivitySchema.pre('deleteMany', function() {
    const { _conditions } = this;
    return deleteSubdocumenets(_conditions);
  });

  function deleteSubdocumenets(conditions) {
    const ActivityModel = mongoose.model('ActivityModel');
    const SubreminderModel = mongoose.model('SubreminderModel');

    return ActivityModel.find(conditions)
      .then(activities =>
        activities.reduce((prev, curr) => prev.concat(curr.subreminders), [])
      )
      .then(subreminders => subreminders.map(s => s._id))
      .then(subreminderIds =>
        SubreminderModel.deleteMany({ _id: { $in: subreminderIds } })
      );
  }

  return mongoose.model('ActivityModel', ActivitySchema);
})();
