module.exports = (() => {
  const DisplayDatePopulator = require('./display-date.populator.js');
  const ActivityPopulator = require('./activity.populator.js');
  const EventPopulator = require('./event.populator.js');
  const SubremindersPopulator = require('./subreminders.populator.js');
  const SubreminderCategoriesPopulater = require('./subreminder-categories.populator.js');
  const CoursePopulator = require('./course.populator.js');

  function populate(reminder) {
    if (!reminder) {
      return null;
    }

    const eventSubreminders = reminder.events.reduce((prev, curr) => {
      const event = EventPopulator.populate(curr);
      return prev.concat(
        SubremindersPopulator.populate(curr.subreminders, event)
      );
    }, []);

    const activitySubreminders = reminder.activities.reduce((prev, curr) => {
      const activity = ActivityPopulator.populate(curr);
      return prev.concat(
        SubremindersPopulator.populate(curr.subreminders, activity)
      );
    }, []);

    const subreminders = [...eventSubreminders, ...activitySubreminders];
    const categories = SubreminderCategoriesPopulater.populate(subreminders);
    const upcommingDisplay = populateUpcommingDisplay(subreminders);
    const course = CoursePopulator.populate(reminder.course);

    return {
      id: reminder._id,
      name: reminder.name,
      subreminders,
      categories,
      upcommingDisplay,
      course
    };
  }

  function populateUpcommingDisplay(subreminders) {
    const upcommingDates = {};
    subreminders
      .slice(0, 4)
      .map(subreminder => subreminder.dateTime)
      .forEach(dateTime => {
        const monthStr = DisplayDatePopulator.populate(
          dateTime,
          DisplayDatePopulator.formats.MONTH_SHORT_ONLY
        );
        if (!upcommingDates[monthStr]) {
          upcommingDates[monthStr] = [];
        }
        upcommingDates[monthStr].push(
          DisplayDatePopulator.populate(
            dateTime,
            DisplayDatePopulator.formats.DAY_DATE_SHORT
          )
        );
      });

    const upcommingDisplay = Object.keys(upcommingDates)
      .map(monthStr => `${monthStr}: ${upcommingDates[monthStr].join(', ')}`)
      .join('; ');
    return upcommingDisplay;
  }

  return { populate };
})();
