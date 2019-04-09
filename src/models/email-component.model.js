module.exports = (() => {
  const mongoose = require('mongoose');

  // const EmailComponentEnum = require('./email-component.enum.js');

  const EmailComponentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // category: {
    //   type: Number,
    //   enum: EmailComponentEnum,
    //   default: EmailComponentEnum.MESSAGE
    // },
    content: String
  });

  return mongoose.model('EmailComponentModel', EmailComponentSchema);
})();
