module.exports = (() => {
  const mongoose = require('mongoose');
  const { ActivityModel } = require('../models');
  const ValidationUtils = require('../utils/validation.util.js');

  function findAllActivities() {
    return ActivityModel.find().populate('reminders');
  }

  function getRemindersByCourseId(course) {
    course = new mongoose.Types.ObjectId(course);
    return ActivityModel.find({ course }).populate('reminders');
  }

  function deleteActivity(id) {
    return new Promise((resolve, reject) => {
      ActivityModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  function createActivity(config, reminderIds) {
    return new Promise((resolve, reject) => {
      var { course } = config;
      const { name, startDate, endDate, startTime, endTime, repeats } = config;
      const startDateSplit = startDate.split('-');
      const endDateSplit = endDate.split('-');
      const startDateTime = new MyDate({
        year: startDateSplit[0],
        month: startDateSplit[1],
        date: startDateSplit[2],
        time: startTime
      }).getDateObject();
      const endDateTime = new MyDate({
        year: endDateSplit[0],
        month: endDateSplit[1],
        date: endDateSplit[2],
        time: endTime
      }).getDateObject();

      // convert course to mongoose id
      course = new mongoose.Types.ObjectId(course);

      // convert reminderIds to mongoose ids
      const reminders = reminderIds.map(
        reminderId => new mongoose.Types.ObjectId(reminderId)
      );

      const _id = new mongoose.Types.ObjectId();

      const activityModel = new ActivityModel({
        _id,
        name,
        startDateTime,
        endDateTime,
        repeats,
        course,
        reminders
      });

      activityModel
        .save()
        .then(resolve)
        .catch(reject);
    });
  }

  return {
    deleteActivity,
    findAllActivities,
    createActivity,
    getRemindersByCourseId
  };
})();
