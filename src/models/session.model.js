module.exports = (() => {
  const mongoose = require('mongoose');

  const SessionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
    creationTime: Date
  });

  return mongoose.model('SessionModel', SessionSchema);
})();
