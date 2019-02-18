module.exports = (() => {
  const assert = require('assert');
  const { AssertionError } = assert;

  function notNull(obj) {
    assert(
      obj !== null && obj !== undefined,
      `${Object.keys({ obj })[0]} should not be null.`
    );
  }

  function notEmpty(obj) {
    assert(obj !== '', `${Object.keys({ obj })[0]} should not be empty.`);
  }

  function notNullOrEmpty(obj) {
    notNull(obj);
    notEmpty(obj);
  }

  const Errors = { AssertionError };

  return { notNull, notEmpty, notNullOrEmpty, Errors };
})();
