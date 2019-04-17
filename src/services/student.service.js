module.exports = (() => {
  const mongoose = require('mongoose');
  const StudentModel = require('../models/student.model.js');
  const ValidationUtils = require('../utils/validation.util.js');

  function findAllStudents() {
    return StudentModel.find().populate('courses');
  }

  function createNewStudent(prefName, email) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(prefName, 'prefer name');
        ValidationUtils.notNullOrEmpty(email, 'email');

        const _id = new mongoose.Types.ObjectId();
        const newStudent = new StudentModel({ _id, prefName, email });
        newStudent
          .save()
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function findStudentByEmail(email) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(email, 'email');
        StudentModel.findOne({ email })
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  return { findAllStudents, createNewStudent, findStudentByEmail };
})();
