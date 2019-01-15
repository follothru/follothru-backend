const { BaseModel } = require('./base.model.js');

class CourseModel extends BaseModel {
  constructor() {
    super();

    this.id;
    this.name;
    this.description;
  }
}

module.exports = { CourseModel };
