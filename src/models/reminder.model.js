const { BaseModel } = require('./base.model.js');

class ReminderModel extends BaseModel {
  constructor() {
    super();

    this.id;
  }
}

module.exports = { ReminderModel };
