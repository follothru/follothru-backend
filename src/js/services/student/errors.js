export const types = {
  STUDENT_GROUP_NOT_FOUND: 'STUDENT_GROUP_NOT_FOUND'
};

export class StudentGroupNotFound extends Error {
  constructor(message) {
    super(message);
    this.type = types.STUDENT_GROUP_NOT_FOUND
  }
}
