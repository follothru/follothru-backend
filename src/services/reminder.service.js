module.exports = (() => {
  const mongoose = require('mongoose');
  const ValidationUtils = require('../utils/validation.util.js');
  const ActivityService = require('./activity.service.js');
  const EventService = require('./event.service.js');
  const EmailService = require('./email.service.js');
  const { EmailModel, EmailComponentModel } = require('../models');

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
        const reminderId = new mongoose.Types.ObjectId();
        const reminder = new ReminderModel({
          _id: reminderId,
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
                reminder: reminderId,
                dateTime: date,
                course
              })
          );
          subreminders.forEach(subreminder => subreminder.save());

          model.subreminders = subreminders;
          return model.save();
        });

        Promise.all(promises)
          .then(() => reminder.save())
          .then(resolve)
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
          result.setHours(result.getHours() - value);
          return result;
        }
        if (name === 'dayAdvance') {
          result.setDate(result.getDate() - value);
          return result;
        }
        if (name === 'weekAdvance') {
          result.setDate(result.getDate() - 7 * value);
          return result;
        }
        if (name === 'monthAdvance') {
          result.setMonth(result.getMonth() - value);
          return result;
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

  function getRemindersByCourseId(courseId) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(courseId, 'courseId');
        getReminders({ course: new mongoose.Types.ObjectId(courseId) })
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function deleteReminderById(reminderId) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(reminderId, 'reminderId');
        ReminderModel.deleteOne({
          _id: new mongoose.Types.ObjectId(reminderId)
        })
          .then(resolve)
          .catch(reject);
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

  function getUpcomingReminders(user) {
    const CourseService = require('./course.service.js');
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(user, 'user');
        CourseService.findAllCoursesForUser(user)
          .then(courses => {
            const courseIds = courses.map(c => c._id);
            const now = new Date();
            return getSubReminders(
              { course: { $in: courseIds }, dateTime: { $gte: now } },
              10
            );
          })
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function getReminders(conditions) {
    return ReminderModel.find(conditions)
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
      })
      .populate('course');
  }

  function getSubReminders(conditions, limit) {
    if (limit) {
      return SubreminderModel.find(conditions)
        .populate('course')
        .sort({ dateTime: 1 })
        .limit(limit);
    }
    return SubreminderModel.find(conditions).sort({ date: -1 });
  }

  function deleteEmailsForReminder(reminderId) {
    return new Promise((resolve, reject) => {
      if (!reminderId) {
        resolve();
        return;
      }
      EmailModel.deleteMany({ reminder: reminderId })
        .then(resolve)
        .catch(reject);
    });
  }

  function deleteEmailsForSubReminder(subreminderId) {
    return new Promise((resolve, reject) => {
      if (!subreminderId) {
        resolve();
        return;
      }
      EmailModel.deleteMany({ subreminder: subreminderId })
        .then(resolve)
        .catch(reject);
    });
  }

  function getReminderEmail(reminderId) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(reminderId, 'reminderId');
        EmailService.getEmailByReminderId(reminderId)
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function setReminderEmail(reminderId, templateIds, values) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(templateIds, 'templateIds');

        const emailComponents = templateIds.map(templateId => {
          let emailComponent = new EmailComponentModel({
            _id: new mongoose.Types.ObjectId(),
            templateId
          });

          if (templateId === 'main-body') {
            ValidationUtils.notNullOrEmpty(values, 'values');
            ValidationUtils.notNullOrEmpty(values.mainMessage, 'mainMessage');

            emailComponent.values = { message: values.mainMessage };
          } else if (templateId === 'do-it-now') {
            ValidationUtils.notNullOrEmpty(values, 'values');
            ValidationUtils.notNullOrEmpty(values.actionUrl, 'actionUrl');

            emailComponent.values = { url: values.actionUrl };
          }
          return emailComponent;
        });

        const reminderIdObj = new mongoose.Types.ObjectId(reminderId);
        deleteEmailsForReminder(reminderId);

        Promise.all(emailComponents.map(comp => comp.save()))
          .then(() => {
            const emailId = new mongoose.Types.ObjectId();
            const newEmail = new EmailModel({
              _id: emailId,
              reminder: reminderIdObj,
              components: emailComponents
            });
            return newEmail
              .save()
              .then(() =>
                ReminderModel.findOneAndUpdate(
                  { _id: reminderIdObj },
                  { $set: { email: emailId } }
                )
              );
          })
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function setSubreminderEmail(subreminderId, templateIds, values) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(subreminderId, 'subreminderId');
        ValidationUtils.notNullOrEmpty(templateIds, 'templateIds');

        templateIds.push('header');
        templateIds.push('main-body');

        const emailComponents = templateIds.map(templateId => {
          let emailComponent = new EmailComponentModel({
            _id: new mongoose.Types.ObjectId(),
            templateId
          });

          if (templateId === 'main-body') {
            ValidationUtils.notNullOrEmpty(values, 'values');
            emailComponent.values = { message: values.mainMessage };
          } else if (templateId === 'do-it-now') {
            ValidationUtils.notNullOrEmpty(values, 'values');
            ValidationUtils.notNullOrEmpty(values.actionUrl, 'actionUrl');
            emailComponent.values = { url: values.actionUrl };
          }
          return emailComponent;
        });

        const subreminderIdObj = new mongoose.Types.ObjectId(subreminderId);
        deleteEmailsForSubReminder(subreminderIdObj);

        Promise.all(emailComponents.map(comp => comp.save()))
          .then(() => {
            const emailId = new mongoose.Types.ObjectId();
            const newEmail = new EmailModel({
              _id: emailId,
              subreminder: subreminderIdObj,
              components: emailComponents
            });
            return newEmail
              .save()
              .then(() =>
                SubreminderModel.findOneAndUpdate(
                  { _id: subreminderIdObj },
                  { $set: { email: emailId } }
                )
              );
          })
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  return {
    findAll,
    getReminderEmail,
    deleteReminderById,
    getRemindersByCourseId,
    createReminders,
    getUpcomingReminders,
    getReminders,
    getSubReminders,
    setReminderEmail,
    setSubreminderEmail
  };
})();
