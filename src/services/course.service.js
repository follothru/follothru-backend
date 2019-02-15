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
    return CourseModel.find({ _id: new mongoose.Types.ObjectId(id) });
  }

  function createCourse(name, description, instructorIds, reminderIds) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(name);
        const instructors = instructorIds
          ? instructorIds.map(id => new mongoose.Types.ObjectId(id))
          : [];
        const reminders = reminderIds
          ? reminderIds.map(id => new mongoose.Types.ObjectId(id))
          : [];
        const _id = new mongoose.Types.ObjectId();
        const active = false;
        const newCourse = new CourseModel({
          _id,
          name,
          description,
          active,
          instructors,
          reminders
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

  return { findAllCourses, createCourse, findCourseById };
})();
