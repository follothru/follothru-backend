module.exports = (() => {
  const DisplayDatePopulator = require('./display-date.populator.js');

  function populate(objects, entityPopulator) {
    const catMap = objects.reduce((prev, curr) => {
      const { dateTime } = curr;
      const year = `${dateTime.getFullYear()}`;
      const month = `${dateTime.getMonth()}`;
      const date = `${dateTime.getDate()}`;
      const yearStr = DisplayDatePopulator.populate(
        dateTime,
        DisplayDatePopulator.formats.FULL_YEAR_ONLY
      );
      const monthStr = DisplayDatePopulator.populate(
        dateTime,
        DisplayDatePopulator.formats.MONTH_ONLY
      );
      const dayStr = DisplayDatePopulator.populate(
        dateTime,
        DisplayDatePopulator.formats.DAY_DATE
      );
      if (!prev[year]) {
        prev[year] = {
          display: yearStr,
          content: {}
        };
      }
      if (!prev[year].content[month]) {
        prev[year].content[month] = {
          display: monthStr,
          content: {}
        };
      }
      if (!prev[year].content[month].content[date]) {
        prev[year].content[month].content[date] = {
          display: dayStr,
          content: []
        };
      }
      prev[year].content[month].content[date].content.push(
        entityPopulator ? entityPopulator.populate(curr) : curr
      );
      return prev;
    }, {});
    return catMap;
  }

  return { populate };
})();
