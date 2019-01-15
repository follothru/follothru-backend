const { BaseModel } = require('./base.model.js');

class RoleModel extends BaseModel {
  constructor() {
    super();

    this.id;
    this.name;
  }
}

module.exports = { RoleModel };
