module.exports = (() => {
  const DEFAULT = 0;
  const MONTH_ONLY = 1;
  const MONTH_SHORT_ONLY = 2;
  const DAY_ONLY = 3;
  const DAY_DATE = 4;
  const DAY_DATE_SHORT = 5;
  const FULL_YEAR_ONLY = 6;

  function populate(date, format = DEFAULT) {
    if (!date) {
      return '';
    }

    const dayStr = getDisplayDay(date);
    const dateStr = getDisplayDate(date);
    const monthStr = getDisplayMonth(date);

    if (format === MONTH_ONLY) {
      return monthStr;
    }
    if (format === MONTH_SHORT_ONLY) {
      return monthStr.substr(0, 3);
    }
    if (format === DAY_ONLY) {
      return dayStr;
    }
    if (format === DAY_DATE) {
      return `${dayStr}, ${dateStr}`;
    }
    if (format === DAY_DATE_SHORT) {
      return `${dateStr} (${dayStr.substr(0, 3)})`;
    }
    if (format === FULL_YEAR_ONLY) {
      return `${date.getFullYear()}`;
    }
    return `${dayStr}, ${dateStr} ${monthStr}`;
  }

  function getDisplayDay(date) {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];
    return days[date.getDay()];
  }

  function getDisplayMonth(date) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return months[date.getMonth()];
  }

  function getDisplayDate(date) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const dateNum = date.getDate();
    return dateNum + (suffixes[dateNum % 10] ? suffixes[dateNum % 10] : 'th');
  }

  return {
    populate,
    formats: {
      DEFAULT,
      MONTH_ONLY,
      MONTH_SHORT_ONLY,
      DAY_ONLY,
      DAY_DATE,
      DAY_DATE_SHORT,
      FULL_YEAR_ONLY
    }
  };
})();
