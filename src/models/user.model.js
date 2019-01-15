const { BaseModel } = require('./base.model.js');

class UserModel {
  constructor() {
    super();

    this.id;
    this.name;
    this.roles = [];
    this.courses = [];
  }
}

module.exports = { UserModel };
