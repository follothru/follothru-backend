module.exports = (() => {
  const mongoose = require('mongoose');
  const CourseModel = require('../models/course.model.js');
  const ValidationUtils = require('../utils/validation.util.js');

  function findAllCourses() {
    return CourseModel.find().populate('instructors');
  }

  function createCourse(name, description, instructorIds) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(name);
        const instructors = instructorIds.map(
          id => new mongoose.Types.ObjectId(id)
        );
        const _id = new mongoose.Types.ObjectId();
        const newCourse = new CourseModel({
          _id,
          name,
          description,
          instructors
        });
        newCourse
          .save()
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  return { findAllCourses, createCourse };
})();
