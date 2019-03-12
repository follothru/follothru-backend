module.exports = (() => {
  const DisplayDatePopulator = require('./display-date.populator.js');
  const ActivityPopulator = require('./activity.populator.js');
  const EventPopulator = require('./event.populator.js');
  const SubremindersPopulator = require('./subreminders.populator.js');

  function populate(reminder) {
    if (!reminder) {
      return null;
    }

    const eventSubreminders = reminder.events.reduce((prev, curr) => {
      const event = EventPopulator.populate(curr);
      return [
        ...prev,
        ...SubremindersPopulator.populate(curr.subreminders, event)
      ];
    }, []);

    const activitySubreminders = reminder.activities.reduce((prev, curr) => {
      const activity = ActivityPopulator.populate(curr);
      return [
        ...prev,
        ...SubremindersPopulator.populate(curr.subreminders, activity)
      ];
    }, []);

    const subreminders = [...eventSubreminders, ...activitySubreminders];
    const categories = populateCategories(subreminders);
    const upcommingDisplay = populateUpcommingDisplay(subreminders);

    return {
      id: reminder._id,
      name: reminder.name,
      subreminders,
      categories,
      upcommingDisplay
    };
  }

  function populateCategories(subreminders = []) {
    const catMap = subreminders.reduce((prev, curr) => {
      const monthStr = DisplayDatePopulator.populate(
        curr.dateTime,
        DisplayDatePopulator.formats.MONTH_ONLY
      );
      const dayStr = DisplayDatePopulator.populate(
        curr.dateTime,
        DisplayDatePopulator.formats.DAY_DATE
      );
      if (!prev[monthStr]) {
        prev[monthStr] = {};
      }
      if (!prev[monthStr][dayStr]) {
        prev[monthStr][dayStr] = [];
      }
      prev[monthStr][dayStr].push(curr);
      return prev;
    }, {});
    return Object.keys(catMap).map(month => {
      const result = Object.keys(catMap[month]).map(day => {
        return {
          category: day,
          content: catMap[month][day]
        };
      });
      return {
        category: month,
        content: result
      };
    });
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
