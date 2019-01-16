const { BaseModel } = require('./base.model.js');

class CourseModel extends BaseModel {
  
  constructor(builder) {
    super();
    this._id = builder._id;
    this._name = builder._name;
    this._description = builder._description;
  }
  
  get id(){
    return this._id;
  }
  
  get name(){
    return this._name;
  }
  
  get description(){
    return this._description;
  }
  
  // builder
  static getBuilder(){
    return new CourseModelBuilder();
  }
}

// builder
class CourseModelBuilder{
  constructor(){
    this._id;
    this._name = '';
    this._description = '';
  }
  buildId(id){
    this._id = id;
    return this;
  }
  buildName(name){
    this._name = name;
    return this;
  }
  buildDescription(description){
    this._description = description;
    return this;
  }
  build(){
    return new CourseModel(this);
  }
}

module.exports = { CourseModel };
