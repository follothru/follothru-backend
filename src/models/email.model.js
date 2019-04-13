module.exports = (() => {
  const mongoose = require('mongoose');

  const EmailSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reminder: { type: mongoose.Schema.Types.ObjectId, ref: 'ReminderModel' },
    subreminder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubreminderModel'
    },
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

  EmailSchema.pre('deleteMany', function() {
    const { _conditions } = this;
    deleteSubdocuments(_conditions);
  });

  function deleteSubdocuments(conditions) {
    const EmailModel = mongoose.model('EmailModel');
    const EmailComponentModel = mongoose.model('EmailComponentModel');
    return EmailModel.find(conditions)
      .then(emails => emails.map(e => e.components))
      .then(components =>
        components.reduce((acc, curr) => acc.concat(curr), [])
      )
      .then(components => components.map(c => c._id))
      .then(componentIds =>
        EmailComponentModel.deleteMany({ _id: { $in: componentIds } })
      );
  }

  return mongoose.model('EmailModel', EmailSchema);
})();
