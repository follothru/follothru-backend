module.exports = (() => {
  const mongoose = require('mongoose');

  const Subreminder = mongoose.Schema({
    name: String,
    dateTime: Date
  });

  return mongoose.model('SubreminderModel', Subreminder);
})();
