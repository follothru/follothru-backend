module.exports = (() => {
  const mongoose = require('mongoose');
  const CourseModel = require('../models/course.model.js');
  const UserService = require('./user.service.js');
  const ReminderService = require('./reminder.service.js');
  const SubreminderService = require('./subreminder.service.js');
  const StudentService = require('./student.service.js');
  const ValidationUtils = require('../utils/validation.util.js');
  const EmailService = require('./email.service.js');

  function findAllCourses() {
    return CourseModel.find().populate('instructors');
  }

  function findAllCoursesForUser(user) {
    if (UserService.isSuperAdmin(user)) {
      return findAllCourses();
    }
    return CourseModel.find({ instructors: user }).populate('instructors');
  }

  function findCourseById(id) {
    return CourseModel.find({ _id: new mongoose.Types.ObjectId(id) })
      .populate('instructors')
      .populate('students')
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

  function getStudentsEnrolled(courseId) {
    return new Promise((resolve, reject) => {
      const id = new mongoose.Types.ObjectId(courseId);
      CourseModel.findOne({ _id: id })
        .populate('students')
        .then(course => course.students)
        .then(resolve)
        .catch(reject);
    });
  }

  function addNewStudent(courseId, newStudent) {
    return CourseModel.updateOne(
      { _id: courseId },
      { $push: { students: newStudent } }
    );
  }

  function studentEnroll(courseId, prefName, email) {
    return new Promise((resolve, reject) => {
      StudentService.createNewStudent(prefName, email)
        .then(newStudent =>
          addNewStudent(new mongoose.Types.ObjectId(courseId), newStudent)
        )
        .then(resolve)
        .catch(reject);
    });
  }

  function getSubreminderById(id) {
    return SubreminderService.getSubreminderById(id);
  }

  function addEmailForSubreminder(subreminderId, email) {
    return SubreminderService.addEmail(subreminderId, email);
  }

  function addComponentsToEmail(emailId, components) {
    return EmailService.addComponentsToEmail(emailId, components);
  }

  return {
    findAllCourses,
    findAllCoursesForUser,
    createCourse,
    findCourseById,
    modifyCourse,
    deleteCourse,
    createReminders,
    getRemindersByCourseId,
    studentEnroll,
    getStudentsEnrolled,
    getSubreminderById,
    addEmailForSubreminder,
    addComponentsToEmail
  };
})();
