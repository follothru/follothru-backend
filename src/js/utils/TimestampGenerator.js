import { StepType } from "./constants";


const StepFunction = {
  DAY: (date, size = 1) => date.setDate(date.getDate() + 1 * size),
  WEEK: (date, size = 1) => date.setDate(date.getDate() + 7 * size),
  MONTH: (date, size = 1) => date.setMonth(date.getMonth() + 1 * size)
};

class TimestampGenerator {
  constructor(startDate, endDate, stepType, stepSize) {
    this.timestamp = new Date(startDate.getTime());
    this.endDate = new Date(endDate.getTime());
    this.stepType = stepType ? stepType : StepType.DAY;
    this.stepSize = stepSize ? stepSize : 1;
  }

  next() {
    if (!this.timestamp || this.timestamp.getTime() > this.endDate.getTime()) {
      return null;
    }

    const orgDate = new Date(this.timestamp.getTime());
    this.increment();
    return orgDate;
  }

  increment() {
    const stepFunc = StepFunction[this.stepType];
    stepFunc(this.timestamp, this.stepSize);
  }

  getTimestamp() {
    return this.timestamp;
  }
}

export default TimestampGenerator;
