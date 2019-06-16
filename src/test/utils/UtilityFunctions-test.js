import { describe, it } from 'mocha';
import { expect } from 'chai';
import { generateTimestamps, offsetDate } from '../../js/utils/UtilityFunctions';
import _ from 'lodash';

const time = 1558901244058;
const makeHourTime = hours => hours * 60 * 60 * 1000;
const makeDayTime = days => days * makeHourTime(24);
const makeWeekTime = weeks => weeks * makeDayTime(7);

describe('utilFunctions', () => {
  describe('offsetDate', () => {
    it('offsets date by hour', () => {
      const date = new Date(time);
      const offsets = [['HOUR', 1], ['HOUR', 2]];
      const expectedDate1 = new Date(time + makeHourTime(1));
      const expectedDate2 = new Date(time + makeHourTime(2));

      const actual = offsetDate(date, offsets);

      expect(actual).to.have.length(offsets.length);
      expect(actual).to.have.deep.members([expectedDate1, expectedDate2]);
    });

    it('offsets date by day', () => {
      const date = new Date(time);
      const offsets = [['DAY', 1], ['DAY', 2]];
      const expectedDate1 = new Date(time + makeDayTime(1));
      const expectedDate2 = new Date(time + makeDayTime(2));

      const actual = offsetDate(date, offsets);

      expect(actual).to.have.length(offsets.length);
      expect(actual).to.have.deep.members([expectedDate1, expectedDate2]);
    });

    it('offsets date by week', () => {
      const date = new Date(time);
      const offsets = [['WEEK', 1], ['WEEK', 2]];
      const expectedDate1 = new Date(time + makeWeekTime(1));
      const expectedDate2 = new Date(time + makeWeekTime(2));

      const actual = offsetDate(date, offsets);

      expect(actual).to.have.length(offsets.length);
      expect(actual).to.have.deep.members([expectedDate1, expectedDate2]);
    });

    it('no offsets specified', () => {
      const date = new Date(time);
      const expectedDate = new Date(time);

      const actual = offsetDate(date);

      expect(actual).to.have.length(1);
      expect(actual[0]).to.eql(expectedDate);
    });

    it('empty offsets', () => {
      const date = new Date(time);
      const expectedDate = new Date(time);

      const actual = offsetDate(date, []);

      expect(actual).to.have.length(1);
      expect(actual[0]).to.eql(expectedDate);
    });
  });

  describe('generateTimestamps', () => {
    it('generates timestamps', () => {
      const startDate = new Date(time);
      const endDate = new Date(time + 30 * 24 * 60 * 60 * 1000);
      const repeats = [
        ['DAY', 1],
        ['DAY', 2],
        ['WEEK', 1]
      ];

      const actual = generateTimestamps(startDate, endDate, repeats);

      expect(actual).to.have.length.greaterThan(repeats.length);
      expect(actual).to.deep.contain(startDate);
      expect(actual).to.deep.contain(endDate);
    });

    it('generates same date', () => {
      const startDate = new Date(time);
      const endDate = new Date(time);
      const repeats = [
        ['DAY', 1],
        ['DAY', 2],
        ['WEEK', 1]
      ];

      const actual = generateTimestamps(startDate, endDate, repeats);

      expect(actual).to.have.length(1);
      expect(actual).to.deep.contain(startDate);
      expect(actual).to.deep.contain(endDate);
    });

    it('should not repeat startDate', () => {
      const startDate = new Date(time);
      const endDate = new Date(time + 30 * 24 * 60 * 60 * 1000);
      const repeats = [
        ['DAY', 1],
        ['DAY', 2]
      ];

      const result = generateTimestamps(startDate, endDate, repeats);
      expect(_.filter(result, date => date.getTime() === startDate.getTime()).length).to.equal(1);
    });
  });
});
