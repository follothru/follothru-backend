module.exports = (() => {
  const mongoose = require('mongoose');

  const SubreminderSchema = mongoose.Schema({
    name: String,
    dateTime: Date,
    course: { type: mongoose.Types.ObjectId, ref: 'CourseModel' },
    email: { type: mongoose.Types.ObjectId, ref: 'EmailModel' }
  });

  SubreminderSchema.pre('deleteMany', function() {
    const { _conditions } = this;
    // deleteSubdocuments(_conditions);
  });

  return mongoose.model('SubreminderModel', SubreminderSchema);
})();
