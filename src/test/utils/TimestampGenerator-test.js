import { describe, it, beforeEach } from "mocha";
import TimestampGenerator from "../../js/utils/TimestampGenerator";
import { expect } from "chai";
import { StepType } from "../../js/utils/constants";

const timePerDay = 24 * 60 * 60 * 1000;

describe("TimestampGenerator", () => {
  describe("generates next date", () => {
    const time = 1558901244058;
    let startDate, endDate;

    beforeEach(() => {
      startDate = new Date(time);
      endDate = new Date(time + 3 * timePerDay);
    });

    it("step size of 1", () => {
      const gen = new TimestampGenerator(startDate, endDate, StepType.DAY, 1);
      const expected = new Date(time + timePerDay);

      expect(gen.next()).to.eql(startDate);
      expect(gen.next()).to.eql(expected);
    });

    it("step size of 2", () => {
      const gen = new TimestampGenerator(startDate, endDate, StepType.DAY, 2);
      const expected = new Date(time + 2 * timePerDay);

      expect(gen.next()).to.eql(startDate);
      expect(gen.next()).to.eql(expected);
      expect(gen.next()).to.eql(null);
    });
  });

  describe("generates next week", () => {
    const time = 1558901244058;
    let startDate, endDate;

    beforeEach(() => {
      startDate = new Date(time);
      endDate = new Date(time + 21 * timePerDay);
    });

    it("step size of 1", () => {
      const gen = new TimestampGenerator(startDate, endDate, StepType.WEEK, 1);
      const expected = new Date(time + 7 * timePerDay);

      expect(gen.next()).to.eql(startDate);
      expect(gen.next()).to.eql(expected);
    });

    it("step size of 3", () => {
      const gen = new TimestampGenerator(startDate, endDate, StepType.WEEK, 3);
      const expected = new Date(time + 3 * 7 * timePerDay);

      expect(gen.next()).to.eql(startDate);
      expect(gen.next()).to.eql(expected);
      expect(gen.next()).to.eql(null);
    });
  });

  describe("generates next month", () => {
    const time = 1558901244058;
    let startDate, endDate;

    beforeEach(() => {
      startDate = new Date(time);
      endDate = new Date(time + 90 * timePerDay);
    });

    it("step size of 1", () => {
      const gen = new TimestampGenerator(startDate, endDate, StepType.MONTH, 1);
      const expected = new Date(startDate);
      expected.setMonth(startDate.getMonth() + 1);

      expect(gen.next()).to.eql(startDate);
      expect(gen.next()).to.eql(expected);
    });

    it("step size of 2", () => {
      const gen = new TimestampGenerator(startDate, endDate, StepType.MONTH, 2);
      const expected = new Date(startDate);
      expected.setMonth(startDate.getMonth() + 2);

      expect(gen.next()).to.eql(startDate);
      expect(gen.next()).to.eql(expected);
      expect(gen.next()).to.equal(null);
    });
  });
});