module.exports = (() => {
  const mongoose = require('mongoose');

  const EmailComponentEnum = require('./email-component.enum.js');

  const EmailComponentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: {
      type: Number,
      enum: EmailComponentEnum,
      default: EmailComponentEnum.MESSAGE
    },
    content: String
  });

  // EmailComponentSchema.virtual('EmailComponentEnum').get(
  //   () => EmailComponentEnum
  // );

  return mongoose.model('EmailComponentModel', EmailComponentSchema);
})();
