module.exports = (() => {
  const mongoose = require('mongoose');
  const { ActivityModel, SubreminderModel } = require('../models');

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

  function deleteActivities(activities) {
    return new Promise((resolve, reject) => {
      if (!activities || activities.length <= 0) {
        resolve({});
        return;
      }
      const subreminderIds = activities
        .map(activity => activity.subreminders)
        .reduce((prev, curr) => [...prev, curr._id], []);
      const activityIds = activities.map(activity => activity._id);

      Promise.all([
        SubreminderModel.deleteMany({ _id: { $in: subreminderIds } }),
        ActivityModel.deleteMany({ _id: { $in: activityIds } })
      ])
        .then(resolve)
        .catch(reject);
    });
  }

  return {
    deleteActivity,
    deleteActivities,
    findAllActivities,
    getRemindersByCourseId
  };
})();
