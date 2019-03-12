module.exports = (() => {
  const mongoose = require('mongoose');
  const ValidationUtils = require('../utils/validation.util.js');
  const ActivityService = require('./activity.service.js');
  const EventService = require('./event.service.js');

  const {
    ReminderModel,
    SubreminderModel,
    EventModel,
    ActivityModel
  } = require('../models');

  function createReminders(
    courseId,
    name,
    type,
    startDateTime,
    endDateTime,
    repeats = [],
    sendTime = []
  ) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(courseId, 'courseId');
        ValidationUtils.notNullOrEmpty(name, 'name');
        ValidationUtils.notNullOrEmpty(type, 'type');
        ValidationUtils.notNullOrEmpty(startDateTime, 'startDateTime');

        if (!endDateTime) {
          endDateTime = startDateTime;
        }
        startDateTime = new Date(startDateTime);
        endDateTime = new Date(endDateTime);

        const course = new mongoose.Types.ObjectId(courseId);
        const dates = generateDates(startDateTime, endDateTime, repeats);

        const reminder = new ReminderModel({
          name,
          course
        });

        let reminders;
        if (type.toUpperCase() === 'ACTIVITY') {
          reminders = dates.map(
            date =>
              new ActivityModel({
                _id: new mongoose.Types.ObjectId(),
                name,
                dateTime: date
              })
          );
          reminder.activities = reminders.map(action => action._id);
        } else if (type.toUpperCase() === 'EVENT') {
          reminders = dates.map(
            date =>
              new EventModel({
                _id: new mongoose.Types.ObjectId(),
                name,
                dateTime: date
              })
          );
          reminder.events = reminders.map(action => action._id);
        }

        if (!reminders) {
          reject(new Error('could not identify reminder type'));
          return;
        }

        const promises = reminders.map(model => {
          const subreminders = dateOffsets(model.dateTime, sendTime).map(
            date =>
              new SubreminderModel({
                name,
                dateTime: date
              })
          );
          subreminders.forEach(subreminder => subreminder.save());

          model.subreminders = subreminders;
          return model.save();
        });

        Promise.all(promises)
          .then(() => {
            return reminder.save();
          })
          .then(reminders => {
            resolve(reminders);
          })
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function dateOffsets(date, options = []) {
    if (!date) {
      return null;
    }
    if (!options || options.length <= 0) {
      return [date];
    }
    const results = options
      .filter(option => option.value !== 0)
      .map(option => {
        const { name, value } = option;
        const result = new Date(date.getTime());
        if (name === 'hourAdvance') {
          result.setHour(result.getHours() - value);
        }
        if (name === 'dayAdvance') {
          result.setDate(result.getDate() - value);
        }
        if (name === 'weekAdvance') {
          result.setDate(result.getDate() - 7 * value);
        }
        if (name === 'monthAdvance') {
          result.setMonth(result.getMonth() - value);
        }
        return result;
      });

    return results;
  }

  function generateDates(startDateTime, endDateTime, options = []) {
    if (endDateTime.getTime() < startDateTime.getTime() || !options) {
      return [];
    }

    const minInterval = 86400000; // 1000 * 3600 * 24
    const dates = Object.keys([
      ...new Array(
        Math.ceil(
          (endDateTime.getTime() - startDateTime.getTime()) / minInterval
        ) + 1
      )
    ])
      .map(dayInterval => {
        return {
          date: new Date(dayInterval * minInterval + startDateTime.getTime()),
          dayInterval: dayInterval - 0
        };
      })
      .map(obj => {
        const { date, dayInterval } = obj;
        return {
          date,
          dayInterval,
          weekInterval: Math.floor(dayInterval / 7),
          monthInterval:
            (date.getFullYear() - startDateTime.getFullYear()) * 12 +
            date.getMonth() -
            startDateTime.getMonth() +
            (date.getDate() < startDateTime.getDate() ? -1 : 0)
        };
      });

    const intvMap = options.reduce((prev, curr) => {
      const key = curr.name;
      const val = curr.value;
      if (!prev[key]) {
        prev[key] = [];
      }
      prev[key].push(val);
      return prev;
    }, {});

    const intvKeys = Object.keys(intvMap);

    const results = dates
      .reduce((prev, curr) => {
        const last = prev[prev.length - 1];
        if (last === undefined) {
          return [curr];
        }
        if (
          intvKeys.some(
            key =>
              last[key] !== curr[key] &&
              intvMap[key].some(intv => curr[key] % intv === 0)
          )
        ) {
          return [...prev, curr];
        }
        return prev;
      }, [])
      .map(obj => obj.date);

    return results;
  }

  function getRemindersById(id) {
    return ReminderModel.findOne({ _id: new mongoose.Types.ObjectId(id) })
      .populate({
        path: 'events',
        populate: {
          path: 'subreminders'
        }
      })
      .populate({
        path: 'activities',
        populate: {
          path: 'subreminders'
        }
      });
  }

  function getRemindersByCourseId(courseId) {
    return ReminderModel.find({ course: new mongoose.Types.ObjectId(courseId) })
      .populate({
        path: 'events',
        populate: {
          path: 'subreminders'
        }
      })
      .populate({
        path: 'activities',
        populate: {
          path: 'subreminders'
        }
      });
  }

  function deleteRemindersByCourseId(courseId) {
    const promise = getRemindersByCourseId(courseId).then(reminders => {
      const events = reminders.reduce(
        (prev, curr) => [...prev, ...curr.events],
        []
      );
      const activities = reminders.reduce(
        (prev, curr) => [...prev, ...curr.activities],
        []
      );
      return Promise.all([
        EventService.deleteEvents(events),
        ActivityService.deleteActivities(activities)
      ]);
    });

    return Promise.all([
      promise,
      ReminderModel.deleteMany({
        course: new mongoose.Types.ObjectId(courseId)
      })
    ]);
  }

  function deleteReminderById(reminderId) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(reminderId, 'reminderId');

        getRemindersById(reminderId).then(reminder =>
          Promise.all([
            EventService.deleteEvents(reminder.events),
            ActivityService.deleteActivities(reminder.activities),
            ReminderModel.deleteOne({
              _id: new mongoose.Types.ObjectId(reminderId)
            })
          ])
            .then(resolve)
            .catch(reject)
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  function findAll() {
    return new Promise((resolve, reject) => {
      let all = [];
      ActivityService.findAllActivities()
        .then(activities => {
          all = all.concat(activities);
          return EventService.findAllEvents();
        })
        .then(events => {
          all = all.concat(events);
          resolve(all);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  }

  return {
    findAll,
    deleteReminderById,
    deleteRemindersByCourseId,
    getRemindersByCourseId,
    createReminders
  };
})();
