/**
 * general message key class
 */
class MessageKey {
  constructor(msg, label) {
    this._msg = msg;
    this._label = label ? label : 'General Error Message';
  }
}

// static variables
MessageKey.BAD_PARAM = 'bad parameter';

module.exports = MessageKey;
