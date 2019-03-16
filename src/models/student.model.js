module.exports = (() => {
  const mongoose = require('mongoose');

  const StudentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    prefName: String,
    email: String,
    verified: { type: Boolean, default: false }
  });

  return mongoose.model('StudentModel', StudentSchema);
})();
