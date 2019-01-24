module.exports = (() => {
  const mongoose = require('mongoose');
  const StudentModel = require('../models/student.model.js');
  const ValidationUtils = require('../utils/validation.util.js');

  function findAllStudents() {
    return StudentModel.find().populate('courses');
  }

  function createNewStudent(prefName, email, courseIds) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(prefName);
        ValidationUtils.notNullOrEmpty(email);
        const _id = new mongoose.Types.ObjectId();
        const courses = courseIds.map(id => new mongoose.Types.ObjectId(id));
        const newStudent = new StudentModel({ _id, prefName, email, courses });
        newStudent
          .save()
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  return { findAllStudents, createNewStudent };
})();
