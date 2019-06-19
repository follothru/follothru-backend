import _ from 'lodash';
import { createModelPopulator } from '../../../utils/UtilityFunctions';

export const populateCourse = course => {
  const { _id, name } = course;
  return { id: _id, name };
}

export const populateCourses = courses =>
  _.map(courses, createModelPopulator(populateCourse));
