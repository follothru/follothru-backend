module.exports = (() => {
  const mongoose = require('mongoose');

  const Subreminder = mongoose.Schema({
    name: String,
    dateTime: Date,
    course: { type: mongoose.Types.ObjectId, ref: 'CourseModel' },
    email: { type: mongoose.Types.ObjectId, ref: 'EmailModel' }
  });

  return mongoose.model('SubreminderModel', Subreminder);
})();
