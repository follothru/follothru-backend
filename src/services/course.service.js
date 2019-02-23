module.exports = (() => {
  const mongoose = require('mongoose');
  const CourseModel = require('../models/course.model.js');
  const ValidationUtils = require('../utils/validation.util.js');

  function findAllCourses() {
    return CourseModel.find()
      .populate('instructors')
      .populate('reminders');
  }

  function findCourseById(id) {
    return CourseModel.find({ _id: new mongoose.Types.ObjectId(id) }).then(
      courses => courses[0]
    );
  }

  function createCourse(name, description, instructorIds) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(name);
        const instructors = instructorIds
          ? instructorIds.map(id => new mongoose.Types.ObjectId(id))
          : [];
        const _id = new mongoose.Types.ObjectId();
        const active = false;
        const newCourse = new CourseModel({
          _id,
          name,
          description,
          active,
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

  function modifyCourse(courseId, name, description, endDate) {
    return findCourseById(courseId).then(course => {
      if (name) {
        course.name = name;
      }
      if (description) {
        course.description = description;
      }
      if (endDate) {
        course.endDate = endDate;
      }
      course.save();
    });
  }

  return { findAllCourses, createCourse, findCourseById, modifyCourse };
})();
