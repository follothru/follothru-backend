module.exports = (() => {
  const mongoose = require('mongoose');

  const EmailSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    components: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmailComponentModel'
      }
    ],
    isSent: {
      type: Boolean,
      default: false
    }
  });

  return mongoose.model('EmailModel', EmailSchema);
})();
