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

  function createCourse(
    name,
    description,
    endDate,
    instructors,
    hasPlanningPrompt,
    planningPrompt
  ) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(name);
        const _id = new mongoose.Types.ObjectId();
        const approved = false;
        const newCourse = new CourseModel({
          _id,
          name,
          description,
          endDate,
          approved,
          instructors,
          hasPlanningPrompt,
          planningPrompt
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

  function modifyCourse(
    courseId,
    name,
    description,
    endDate,
    hasPlanningPrompt,
    planningPrompt
  ) {
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
      course.hasPlanningPrompt = hasPlanningPrompt;
      planningPrompt = hasPlanningPrompt
        ? planningPrompt
        : course.planningPrompt;
      course.planningPrompt = planningPrompt;
      course.save();
      return course;
    });
  }

  function deleteCourse(courseId) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(courseId, 'courseId');
        ReminderService.deleteRemindersByCourseId(courseId);
        CourseModel.deleteOne({ _id: new mongoose.Types.ObjectId(courseId) })
          .then(result => {
            if (result.n <= 0) {
              const error = `Failed to delete course: no course found with id '${courseId}'`;
              reject(new Error(error));
              return;
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

  function createReminders(
    courseId,
    name,
    type,
    startDateTime,
    endDateTime,
    repeats,
    sendTime
  ) {
    return ReminderService.createReminders(
      courseId,
      name,
      type,
      startDateTime,
      endDateTime,
      repeats,
      sendTime
    );
  }

  function getRemindersByCourseId(courseId) {
    return ReminderService.getRemindersByCourseId(courseId);
  }

  return {
    findAllCourses,
    findAllCoursesForCurrentUser,
    createCourse,
    findCourseById,
    modifyCourse,
    deleteCourse,
    createReminders,
    getRemindersByCourseId
  };
})();
