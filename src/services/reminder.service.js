module.exports = (() => {
  const mongoose = require('mongoose');
  const ValidationUtils = require('../utils/validation.util.js');

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
    startDate,
    endDate,
    repeats = {}
  ) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(courseId, 'courseId');
        ValidationUtils.notNullOrEmpty(name, 'name');
        ValidationUtils.notNullOrEmpty(startDate, 'startDate');
        if (!endDate) {
          endDate = startDate;
        }
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        const { dayInterval, weekInterval, monthInterval } = repeats;
        const course = new mongoose.Types.ObjectId(courseId);
        const dates = generateDates(startDate, endDate, {
          dayInterval,
          weekInterval,
          monthInterval
        });

        const reminder = new ReminderModel({
          name,
          course
        });

        let reminderActions;

        if (type.toUpperCase() === 'ACTIVITY') {
          reminderActions = dates.map(
            date =>
              new ActivityModel({
                _id: new mongoose.Types.ObjectId(),
                name,
                dateTime: date
              })
          );
          reminder.activities = reminderActions.map(action => action._id);
        } else if (type.toUpperCase() === 'EVENT') {
          reminderActions = dates.map(
            date =>
              new EventModel({
                _id: new mongoose.Types.ObjectId(),
                name,
                dateTime: date
              })
          );
          reminder.events = reminderActions.map(action => action._id);
        }

        if (!reminderActions) {
          reject(new Error('could not identify reminder type'));
          return;
        }

        const promises = reminderActions.map(model => {
          const subreminder = new SubreminderModel({
            name,
            dateTime: model.dateTime
          });
          model.subreminder = subreminder;
          subreminder.save();
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

  function generateDates(startDate, endDate, options = {}) {
    if (endDate.getTime() < startDate.getTime()) {
      return [];
    }
    const { dayInterval, weekInterval, monthInterval } = options;
    if (
      dayInterval === undefined &&
      weekInterval === undefined &&
      monthInterval === undefined
    ) {
      return [startDate];
    }
    const minInterval = 86400000; // 1000 * 3600 * 24
    const dates = Object.keys([
      ...new Array(
        Math.ceil((endDate.getTime() - startDate.getTime()) / minInterval) + 1
      )
    ])
      .map(daysDiff => {
        return {
          date: new Date(daysDiff * minInterval + startDate.getTime()),
          daysDiff: daysDiff - 0
        };
      })
      .map(obj => {
        const { date, daysDiff } = obj;
        return {
          date,
          daysDiff,
          weeksDiff: Math.floor(daysDiff / 7),
          monthsDiff:
            (date.getFullYear() - startDate.getFullYear()) * 12 +
            date.getMonth() -
            startDate.getMonth() +
            (date.getDate() < startDate.getDate() ? -1 : 0)
        };
      });

    const intvMap = {};
    if (dayInterval) {
      intvMap['daysDiff'] = dayInterval;
    }
    if (weekInterval) {
      intvMap['weeksDiff'] = weekInterval;
    }
    if (monthInterval) {
      intvMap['monthsDiff'] = monthInterval;
    }
    const intvKeys = Object.keys(intvMap);

    const results = dates
      .reduce((prev, curr) => {
        const last = prev[prev.length - 1];
        if (last === undefined) {
          return [curr];
        }
        if (
          intvKeys.some(
            key => last[key] !== curr[key] && curr[key] % intvMap[key] === 0
          )
        ) {
          return [...prev, curr];
        }
        return prev;
      }, [])
      .map(obj => obj.date);

    return results;
  }

  function getRemindersByCourseId(courseId) {
    return ReminderModel.find({ course: new mongoose.Types.ObjectId(courseId) })
      .populate({
        path: 'events',
        populate: {
          path: 'subreminder'
        }
      })
      .populate({
        path: 'activities',
        populate: {
          path: 'subreminder'
        }
      });
  }

  function deleteReminderById(reminderId) {
    return new Promise((resolve, reject) => {
      ActivityService.deleteActivity(reminderId)
        .then(result => {
          if (result.n <= 0) {
            // try deleting it from Event Service
            return EventService.deleteEvent(reminderId);
          }
        })
        .then(result => {
          if (result.n <= 0) {
            throw 'reminder does not exist';
          }
          resolve('deleted successfully');
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
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

  // function createReminder(config) {
  //   return new Promise((resolve, reject) => {
  //     const { name, startDate, endDate, startTime, endTime, repeats } = config;
  //     const reminders = createReminders(
  //       startDate,
  //       endDate,
  //       repeats,
  //       startTime,
  //       endTime
  //     );
  //     const reminderModels = reminders.map(myDate => {
  //       const dateTime = myDate.getDateObject();
  //       return new Promise((resolve, reject) => {
  //         const newRmd = new ReminderModel({
  //           name,
  //           dateTime
  //         });
  //         newRmd
  //           .save()
  //           .then(resolve)
  //           .catch(reject);
  //       });
  //     });

  //     Promise.all(reminderModels)
  //       .then(values => {
  //         values = values.map(value => value._id);
  //         resolve(values);
  //       })
  //       .catch(err => {
  //         reject(err);
  //         console.log(err);
  //       });
  //   });
  // }

  // function createReminders(startDate, endDate, repeats, startTime, endTime) {
  //   const startDateSplit = startDate.split('-');
  //   const endDateSplit = endDate.split('-');
  //   const regexes = {
  //     daily: /DAILY/i,
  //     weekly: /WEEKLY/i,
  //     monthly: /MONTHLY/i,
  //     everyXDays: /EVERY ([1-9][0-9]*) DAY/
  //   };
  //   const occurrence = repeats.map(repeat => {
  //     if (repeat.match(regexes.daily)) {
  //       const start = new MyDate({
  //         year: startDateSplit[0],
  //         month: startDateSplit[1],
  //         date: startDateSplit[2],
  //         time: startTime
  //       });
  //       const end = new MyDate({
  //         year: endDateSplit[0],
  //         month: endDateSplit[1],
  //         date: endDateSplit[2],
  //         time: endTime
  //       });
  //       return start.countDaily(end);
  //     } else if (repeat.match(regexes.weekly)) {
  //       const start = new MyDate({
  //         year: startDateSplit[0],
  //         month: startDateSplit[1],
  //         date: startDateSplit[2],
  //         time: startTime
  //       });
  //       const end = new MyDate({
  //         year: endDateSplit[0],
  //         month: endDateSplit[1],
  //         date: endDateSplit[2],
  //         time: endTime
  //       });
  //       return start.countWeekly(end);
  //     } else if (repeat.match(regexes.monthly)) {
  //       const start = new MyDate({
  //         year: startDateSplit[0],
  //         month: startDateSplit[1],
  //         date: startDateSplit[2],
  //         time: startTime
  //       });
  //       const end = new MyDate({
  //         year: endDateSplit[0],
  //         month: endDateSplit[1],
  //         date: endDateSplit[2],
  //         time: endTime
  //       });
  //       return start.countMonthly(end);
  //     } else if (repeat.match(regexes.everyXDays)) {
  //       return [];
  //     }
  //   });
  //   let convertToOneDArr = [];
  //   for (let i = 0; i < occurrence.length; i++) {
  //     convertToOneDArr = convertToOneDArr.concat(occurrence[i]);
  //   }
  //   return convertToOneDArr;
  // }

  return {
    findAll,
    deleteReminderById,
    getRemindersByCourseId,
    createReminders
  };
})();
