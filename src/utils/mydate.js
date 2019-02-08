/**
 * _dateObject is js native Data object
 */

const { Exception, MyDateMessageKey } = require('./index.js');

class MyDate {
  constructor(config) {
    this._ONEDAYINMILLS = 24 * 60 * 60 * 1000;
    this._isDatePossible = false;
    this.initDateObject(config);
  }

  initDateObject(config) {
    if (config.milliseconds !== null && config.milliseconds !== undefined) {
      this._dateObject = this.initDateObjectByMilliseconds(config.milliseconds);
      this._year = this.getDateObjectYear();
      this._month = this.getDateObjectMonth() + 1;
      this._date = this.getDateObjectDate();
    } else {
      this._dateObject = this.initDateObjectByDate(config);
      this._year = config.year;
      this._month = config.month;
      this._date = config.date;
    }
  }

  initDateObjectByMilliseconds(milliseconds) {
    this._isDatePossible = true;
    return new Date(milliseconds);
  }

  initDateObjectByDate(config) {
    try {
      if (
        !this.isLeapYear(config.year) &&
        config.month == 2 &&
        config.date > 28
      ) {
        throw new Exception(MyDateMessageKey.LEAP_YEAR_EXCEPTION);
      } else if (
        this.isLeapYear(config.year) &&
        config.month == 2 &&
        config.date > 29
      ) {
        throw new Exception(MyDateMessageKey.DATE_RANGE_EXCEPTION);
      } else {
        this._isDatePossible = true;
        const d = config.year + '/' + config.month + '/' + config.date;
        return new Date(d);
      }
    } catch (err) {
      return null;
    }
  }

  getYear() {
    return this._year;
  }

  getDateObjectYear() {
    try {
      return this._dateObject.getFullYear();
    } catch (err) {
      return new Exception(MyDateMessageKey.DATE_OBJECT_EXCEPTION);
    }
  }

  getIsDatePossible() {
    return this._isDatePossible;
  }

  getMonth() {
    return this._month;
  }

  getDateObjectMonth() {
    try {
      return this._dateObject.getMonth();
    } catch (err) {
      return new Exception(MyDateMessageKey.DATE_OBJECT_EXCEPTION);
    }
  }

  getDate() {
    return this._date;
  }

  getDateObjectDate() {
    try {
      return this._dateObject.getDate();
    } catch (err) {
      return new Exception(MyDateMessageKey.DATE_OBJECT_EXCEPTION);
    }
  }

  getHours() {
    try {
      return this._dateObject.getHours();
    } catch (err) {
      return new Exception(MyDateMessageKey.DATE_OBJECT_EXCEPTION);
    }
  }

  getMinutes() {
    try {
      return this._dateObject.getMinutes();
    } catch (err) {
      return new Exception(MyDateMessageKey.DATE_OBJECT_EXCEPTION);
    }
  }

  getSeconds() {
    try {
      return this._dateObject.getSeconds();
    } catch (err) {
      return new Exception(MyDateMessageKey.DATE_OBJECT_EXCEPTION);
    }
  }

  // gets millisecond representation of time object
  getTime() {
    try {
      return this._dateObject.getTime();
    } catch (err) {
      return new Exception(MyDateMessageKey.DATE_OBJECT_EXCEPTION);
    }
  }

  getDateObject() {
    try {
      return this._dateObject;
    } catch (err) {
      return new Exception(MyDateMessageKey.DATE_OBJECT_EXCEPTION);
    }
  }

  toString() {
    return (
      this.getYear() +
      '-' +
      (this.getMonth() >= 10 ? this.getMonth() : '0' + this.getMonth()) +
      '-' +
      (this.getDate() >= 10 ? this.getDate() : '0' + this.getDate()) +
      'T' +
      (this.getHours() >= 10 ? this.getHours() : '0' + this.getHours()) +
      ':' +
      (this.getMinutes() >= 10 ? this.getMinutes() : '0' + this.getMinutes()) +
      ':' +
      (this.getSeconds() >= 10 ? this.getSeconds() : '0' + this.getSeconds())
    );
  }

  // repeats the event every daily at same time
  countDaily(endDate) {
    if (this.getTime() > endDate.getTime()) {
      throw new Exception(MyDateMessageKey.DATE_RANGE_EXCEPTION);
    }
    const numOfDays = Math.ceil(
      (endDate.getTime() - this.getTime()) / this._ONEDAYINMILLS
    );
    const days = [...new Array(numOfDays).keys()].map(index => {
      return new MyDate({
        milliseconds: this.getTime() + index * this._ONEDAYINMILLS
      });
    });
    return days;
  }

  // repeats the event every week at same time
  countWeekly(endDate) {
    if (this.getTime() > endDate.getTime()) {
      throw new Exception(MyDateMessageKey.DATE_RANGE_EXCEPTION);
    }
    const numOfWeeks = Math.ceil(
      (endDate.getTime() - this.getTime()) / (this._ONEDAYINMILLS * 7)
    );

    const weeks = [...new Array(numOfWeeks).keys()].map(index => {
      return new MyDate({
        milliseconds: this.getTime() + index * this._ONEDAYINMILLS * 7
      });
    });

    return weeks;
  }

  // repeats the event monthly on specific date at same time
  countMonthly(endDate) {
    if (this.getTime() > endDate.getTime()) {
      throw new Exception(MyDateMessageKey.DATE_RANGE_EXCEPTION);
    }

    const numOfMonths =
      (endDate.getYear() - this.getYear()) * 12 +
      (endDate.getMonth() - this.getMonth());

    const months = [...new Array(numOfMonths).keys()].map(index => {
      let monthOffSet = this.getMonth() + index;
      let yearOffSet = this.getYear();
      while (monthOffSet > 12) {
        // increment year
        yearOffSet += 1;
        // get remainder of monthOffSet
        monthOffSet = monthOffSet % 12;
      }

      // if date exists in month in given year
      if (
        this.getDate() <= this.getDaysInMonthAndYear(yearOffSet, monthOffSet)
      ) {
        const myDate = new MyDate({
          year: yearOffSet,
          month: monthOffSet,
          date: this.getDate()
        });
        if (
          myDate.getIsDatePossible() &&
          myDate.getTime() <= endDate.getTime()
        ) {
          return myDate;
        }
      }
    });
    return months;
  }
  getDaysInMonthAndYear(year, month) {
    return new Date(year, month, 0).getDate();
  }
  isLeapYear(year) {
    return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
  }
}

module.exports = MyDate;
