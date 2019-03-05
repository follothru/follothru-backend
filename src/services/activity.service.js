module.exports = (() => {
  const mongoose = require('mongoose');
  const { ActivityModel } = require('../models');
  const { MyDate } = require('../utils');

  function findAllActivities() {
    return new Promise((resolve, reject) => {
      ActivityModel.find()
        .populate('reminders')
        .then(results => {
          results = filterActivities(results);
          resolve(results);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // private function
  // determines what will be exposed to api
  function filterActivities(activities) {
    activities = activities.map(activity => {
      const { name, startDateTime, endDateTime, course, repeats } = activity;
      let { reminders } = activity;
      reminders = reminders.map(reminder => {
        const { name, dateTime } = reminder;
        return { name, dateTime };
      });
      return {
        name,
        startDateTime,
        endDateTime,
        course,
        reminders,
        repeats
      };
    });
    return activities;
  }

  function getRemindersByCourseId(course) {
    course = new mongoose.Types.ObjectId(course);
    return new Promise((resolve, reject) => {
      ActivityModel.find({ course })
        .populate('subreminder')
        .then(results => {
          results = filterActivities(results);
          resolve(results);
        })
        .catch(err => {
          reject(err);
        });
    });
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
      let { course } = config;
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
