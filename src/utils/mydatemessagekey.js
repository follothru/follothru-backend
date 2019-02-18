/**
 * message key class for mydate class
 */
const MessageKey = require('./messagekey.js');

class MyDateMessageKey extends MessageKey {
  constructor(msg) {
    super(msg, 'MyDate Error Message');
  }
}

MyDateMessageKey.DATE_OBJECT_EXCEPTION = 'no date object';
MyDateMessageKey.LEAP_YEAR_EXCEPTION = 'not a leap year';
MyDateMessageKey.DATE_RANGE_EXCEPTION = 'date out of bound';

module.exports = MyDateMessageKey;
