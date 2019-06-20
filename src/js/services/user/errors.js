export const types = {
  USER_ALREADY_EXISTED: 'USER_ALREADY_EXISTED'
};

export class UserAlreadyExistedError extends Error {
  constructor(message) {
    super(message);
    this.type = types.USER_ALREADY_EXISTED;
  }
}
