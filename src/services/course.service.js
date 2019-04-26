module.exports = (() => {
  const mongoose = require('mongoose');
  const CourseModel = require('../models/course.model.js');
  const UserService = require('./user.service.js');
  const ReminderService = require('./reminder.service.js');
  const SubreminderService = require('./subreminder.service.js');
  const StudentService = require('./student.service.js');
  const ValidationUtils = require('../utils/validation.util.js');
  const EmailService = require('./email.service.js');

  const EMAIL_ALREADY_REGISTERED = 'EMAIL_ALREADY_REGISTERED';
  const EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED';

  class EmailAlreadyRegisteredError extends Error {
    constructor(message) {
      super(message);
      this.type = EMAIL_ALREADY_REGISTERED;
    }
  }

  class EmailNotVerifiedError extends Error {
    constructor(message) {
      super(message);
      this.type = EMAIL_NOT_VERIFIED;
    }
  }

  const Errors = {
    EmailAlreadyRegisteredError,
    EmailNotVerifiedError
  };

  function findCourse(conditions) {
    return CourseModel.findOne(conditions);
  }

  function findCourses(conditions) {
    return conditions ? CourseModel.find(conditions) : CourseModel.find();
  }

  function findCourseById(id) {
    return CourseModel.findById(id);
  }

  function populateStudents(coursePromise) {
    return coursePromise.populate('students');
  }

  function populateInstructors(coursePromise) {
    return coursePromise.populate('instructors');
  }

  function populateCourseFields(coursePromise) {
    return populateStudents(populateInstructors(coursePromise));
  }

  function findAllCoursesForUser(user) {
    if (UserService.isSuperAdmin(user) || UserService.isAdmin(user)) {
      return findCourses().populate('instructors');
    }
    return findCourses({ instructors: user }).populate('instructors');
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
    return populateCourseFields(findCourseById(courseId)).then(course => {
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

  function approveCourse(courseId) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(courseId, 'courseId');
        CourseModel.updateOne(
          { _id: new mongoose.Types.ObjectId(courseId) },
          { $set: { approved: true } }
        )
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
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

  function getStudentEnrollStatus(courseId, studentId) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(courseId, 'courseId');
        ValidationUtils.notNullOrEmpty(studentId, 'studentId');

        CourseModel.findOne({
          _id: new mongoose.Types.ObjectId(courseId)
        })
          .populate('students')
          .then(course => {
            if (!course) {
              reject(new Error('The requested course dose not exist.'));
              return;
            }
            return course.students;
          })
          .then(
            students =>
              students.filter(student => student._id.equals(studentId))[0]
          )
          .then(student => {
            if (!student) {
              reject(new Error('The requested student info is not found.'));
              return;
            }
            return student;
          })
          .then(student =>
            resolve({ email: student.email, verified: student.verified })
          );
      } catch (err) {
        reject(err);
      }
    });
  }

  function addNewStudentToCourse(courseIdObj, prefName, email) {
    return StudentService.createNewStudent(prefName, email).then(newStudent =>
      CourseModel.updateOne(
        { _id: courseIdObj },
        { $push: { students: newStudent } }
      ).then(() => newStudent)
    );
  }

  function studentEnroll(courseId, prefName, email) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(courseId, 'courseId');
        ValidationUtils.notNullOrEmpty(prefName, 'prefName');
        ValidationUtils.notNullOrEmpty(email, 'email');

        getStudentsEnrolled(courseId)
          .then(
            students => students.filter(student => student.email === email)[0]
          )
          .then(student => {
            if (!student) {
              return addNewStudentToCourse(
                new mongoose.Types.ObjectId(courseId),
                prefName,
                email
              );
            }
            if (student.verified) {
              reject(
                new EmailAlreadyRegisteredError(
                  'This email has already been registered.'
                )
              );
              return;
            }
            reject(
              new EmailNotVerifiedError(
                'This email has already been registered.'
              )
            );
          })
          .then(student => resolve({ studentId: student._id, courseId }))
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function validateEnroll(courseId, email) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(courseId, 'courseId');
        ValidationUtils.notNullOrEmpty(email, 'email');

        getStudentsEnrolled(courseId)
          .then(
            students => students.filter(student => student.email === email)[0]
          )
          .then(student => {
            if (!student) {
              resolve();
              return;
            }
            if (student.verified) {
              reject(
                new EmailAlreadyRegisteredError(
                  'This email has already been registered.'
                )
              );
              return;
            }
            reject(
              new EmailNotVerifiedError(
                'This email has already been registered.'
              )
            );
          })
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function getSubreminderById(id) {
    return SubreminderService.getSubreminderById(id);
  }

  function addEmailForSubreminder(subreminderId, emailComponents) {
    return SubreminderService.addEmail(subreminderId, emailComponents);
  }

  function addComponentsToEmail(emailId, components) {
    return EmailService.addComponentsToEmail(emailId, components);
  }

  function removeStudent(courseId, studentId) {
    return CourseModel.updateOne(
      { _id: courseId },
      { $pull: { students: studentId } }
    );
  }

  return {
    findAllCoursesForUser,
    createCourse,
    findCourseById,
    modifyCourse,
    deleteCourse,
    createReminders,
    getRemindersByCourseId,
    approveCourse,
    studentEnroll,
    getStudentsEnrolled,
    getSubreminderById,
    addEmailForSubreminder,
    addComponentsToEmail,
    removeStudent,
    getStudentEnrollStatus,
    validateEnroll,
    Errors
  };
})();
