module.exports = (() => {
  const mongoose = require('mongoose');

  const EmailComponentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    templateId: String,
    values: JSON
  });

  return mongoose.model('EmailComponentModel', EmailComponentSchema);
})();
