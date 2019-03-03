module.exports = (() => {
  const mongoose = require('mongoose');
  const CourseModel = require('../models/course.model.js');
  const UserService = require('./user.service.js');
  const ReminderService = require('./reminder.service.js');
  const ValidationUtils = require('../utils/validation.util.js');

  function findAllCourses() {
    return CourseModel.find().populate('instructors');
  }

  function findAllCoursesForCurrentUser(currentUser) {
    if (UserService.isSuperAdmin(currentUser)) {
      return findAllCourses();
    }
    return CourseModel.find({ instructors: currentUser }).populate(
      'instructors'
    );
  }

  function findCourseById(id) {
    return CourseModel.find({ _id: new mongoose.Types.ObjectId(id) })
      .populate('instructors')
      .then(courses => courses[0]);
  }

  function createCourse(config) {
    const {
      name,
      description,
      endDate,
      instructors,
      hasPlanningPrompt,
      planningPrompt
    } = config;
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(name, 'name');
        const _id = new mongoose.Types.ObjectId();
        const approved = false;
        const newCourse = new CourseModel({
          _id,
          name,
          description,
          endDate,
          approved,
          instructors,
          hasPlanningPrompt
        });
        if (hasPlanningPrompt) {
          newCourse.planningPrompt = planningPrompt;
        }
        newCourse
          .save()
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function modifyCourse(config) {
    const {
      courseId,
      name,
      description,
      endDate,
      hasPlanningPrompt,
      planningPrompt
    } = config;
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
      course.hasPlanningPrompt = hasPlanningPrompt === true;
      if (hasPlanningPrompt) {
        course.planningPrompt = planningPrompt;
      }
      course.save();
      return course;
    });
  }

  function deleteCourse(courseId) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(courseId, 'courseId');
        CourseModel.deleteOne({ _id: courseId })
          .then(result => {
            if (result.n <= 0) {
              const error = `Failed to delete course: no course found with id ${courseId}`;
              throw new Error(error);
            }
            resolve(result);
            return result;
          })
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function createReminders(courseId, name, startDate, endDate, repeats) {
    return ReminderService.createReminders(
      courseId,
      name,
      startDate,
      endDate,
      repeats
    );
  }

  function getReminders(courseId) {
    return ReminderService.findRemindersByCourseId(courseId);
  }

  return {
    findAllCourses,
    findAllCoursesForCurrentUser,
    createCourse,
    findCourseById,
    modifyCourse,
    deleteCourse,
    createReminders,
    getReminders
  };
})();
