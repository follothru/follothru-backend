export const types = {
  COURSE_NOT_FOUND: 'COURSE_NOT_FOUND'
};

export class CourseNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.type = types.COURSE_NOT_FOUND
  }
}
