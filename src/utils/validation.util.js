module.exports = (() => {
  const assert = require('assert');
  const { AssertionError } = assert;

  function notNull(obj, name) {
    assert(obj !== null && obj !== undefined, `${name} should not be null.`);
  }

  function notEmpty(obj, name) {
    assert(obj !== '', `${name} should not be empty.`);
  }

  function notNullOrEmpty(obj, name) {
    notNull(obj, name);
    notEmpty(obj, name);
  }

  const Errors = { AssertionError };

  return { notNull, notEmpty, notNullOrEmpty, Errors };
})();
