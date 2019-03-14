const UserModel = require('./user.model.js');
const SessionModel = require('./session.model.js');
const CourseModel = require('./course.model.js');
const ReminderModel = require('./reminder.model.js');
const SubreminderModel = require('./subreminder.model.js');
const StudentModel = require('./student.model.js');
const EventModel = require('./event.model.js');
const ActivityModel = require('./activity.model.js');
const UserModelEnum = require('./user.model.enum.js');

module.exports = {
  UserModel,
  UserModelEnum,
  SessionModel,
  CourseModel,
  ReminderModel,
  SubreminderModel,
  StudentModel,
  EventModel,
  ActivityModel
};
