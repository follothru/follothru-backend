module.exports = (() => {
  const mongoose = require('mongoose');
  const { EventModel } = require('../models');

  function findAllEvents() {
    return new Promise((resolve, reject) => {
      EventModel.find()
        .populate('reminders')
        .then(events => {
          events = filterEvents(events);
          resolve(events);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  function getRemindersByCourseId(course) {
    course = new mongoose.Types.ObjectId(course);
    return new Promise((resolve, reject) => {
      EventModel.find({ course })
        .populate('reminders')
        .then(events => {
          events = filterEvents(events);
          resolve(events);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // private function
  // determines what will exposed to API
  function filterEvents(events) {
    events = events.map(event => {
      const { name, startDateTime, endDateTime, course, repeats } = event;
      let { reminders } = event;
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
    return events;
  }

  function deleteEvent(id) {
    return new Promise((resolve, reject) => {
      EventModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  return { deleteEvent, findAllEvents, getRemindersByCourseId };
})();
