// this vault is an intermediate level for EventService and ActivityService
const ActivityService = require('./activity.service.js');
const EventService = require('./event.service.js');
module.exports = (() => {
  function getRemindersByCourseId(course) {
    return new Promise((resolve, reject) => {
      let all = [];
      ActivityService.getRemindersByCourseId(course)
        .then(reminders => {
          all = all.concat(reminders);
          return EventService.getRemindersByCourseId(course);
        })
        .then(reminders => {
          all = all.concat(reminders);
          resolve(all);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
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
  return { findAll, deleteReminderById, getRemindersByCourseId };
})();
