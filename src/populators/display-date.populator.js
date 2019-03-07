module.exports = (() => {
  const DEFAULT = 0;
  const MONTH_ONLY = 1;
  const MONTH_SHORT_ONLY = 2;
  const DAY_ONLY = 3;
  const DAY_DATE = 4;
  const DAY_DATE_SHORT = 5;

  function populate(date, format = DEFAULT) {
    if (!date) {
      return '';
    }

    const dayStr = getDisplayDay(date);
    const dateStr = getDisplayDate(date);
    const monthStr = getDisplayMonth(date);

    switch (format) {
    case MONTH_ONLY:
      return monthStr;

    case MONTH_SHORT_ONLY:
      return monthStr.substr(0, 3);

    case DAY_ONLY:
      return dayStr;

    case DAY_DATE:
      return `${dayStr}, ${dateStr}`;

    case DAY_DATE_SHORT:
      return `${dateStr} (${dayStr.substr(0, 3)})`;

    case DEFAULT:
    default:
      return `${dayStr}, ${dateStr} ${monthStr}`;
    }
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
    const dateNum = date.getDate() + 1;
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
      DAY_DATE_SHORT
    }
  };
})();
