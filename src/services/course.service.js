module.exports = (() => {
  const mongoose = require('mongoose');
  const { CourseModel } = require('../models/course.model.js');
  const UserService = require('./user.service.js');
  const ValidationUtils = require('../utils/validation.util.js');

  function findAllCourses() {
    return CourseModel.find()
      .populate('instructors')
      .then(courses =>
        courses.map(course => {
          const id = course._id;
          const name = course.name;
          const description = course.description;
          const instructors = course.instructors.map(instructor => {
            const id = instructor._id;
            const { firstname, lastname, email } = instructor;
            return { id, firstname, lastname, email };
          });

          return { id, name, description, instructors };
        })
      );
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
          .then(result => resolve({ id: result._id }))
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  return { findAllCourses, createCourse };
})();
