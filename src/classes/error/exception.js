class Exception {
  constructor(msg) {
    this._msg = msg;
  }
  toString() {
    return this._msg;
  }
}

module.exports = Exception;
