class Exception {
  constructor(messageKey) {
    this.label = messageKey._label;
    this.message = messageKey._msg;
  }
}

module.exports = Exception;
