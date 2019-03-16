module.exports = (() => {
  const DisplayDatePopulator = require('./display-date.populator.js');
  const SubremindersPopulator = require('./subreminders.populator.js');
  const SubreminderPopulator = require('./subreminder.populator.js');
  const DateTimeCategoriesPopulater = require('./datetime-categories.populator.js');
  const CoursePopulator = require('./course.populator.js');

  function populate(reminder) {
    if (!reminder) {
      return null;
    }

    const eventSubreminders = reminder.events.reduce(
      (prev, curr) => prev.concat(curr.subreminders),
      []
    );

    const activitySubreminders = reminder.activities.reduce(
      (prev, curr) => prev.concat(curr.subreminders),
      []
    );

    const subreminders = eventSubreminders.concat(activitySubreminders);
    const categories = DateTimeCategoriesPopulater.populate(
      subreminders,
      SubreminderPopulator
    );
    const subreminderResults = SubremindersPopulator.populate(subreminders);
    const upcomingDisplay = populateUpcomingDisplay(subreminders);
    const course = CoursePopulator.populate(reminder.course);

    return {
      id: reminder._id,
      name: reminder.name,
      subreminders: subreminderResults,
      categories,
      upcomingDisplay,
      course
    };
  }

  function populateUpcomingDisplay(subreminders) {
    const upcomingDates = {};
    subreminders
      .slice(0, 4)
      .map(subreminder => subreminder.dateTime)
      .sort((a, b) => a.getTime() - b.getTime())
      .forEach(dateTime => {
        const monthStr = DisplayDatePopulator.populate(
          dateTime,
          DisplayDatePopulator.formats.MONTH_SHORT_ONLY
        );
        if (!upcomingDates[monthStr]) {
          upcomingDates[monthStr] = [];
        }
        upcomingDates[monthStr].push(
          DisplayDatePopulator.populate(
            dateTime,
            DisplayDatePopulator.formats.DAY_DATE_SHORT
          )
        );
      });

    const upcomingDisplay = Object.keys(upcomingDates)
      .map(monthStr => `${monthStr}: ${upcomingDates[monthStr].join(', ')}`)
      .join('; ');
    return upcomingDisplay;
  }

  return { populate };
})();
