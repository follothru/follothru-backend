export const types = {
  REMINDER_NOT_FOUND: 'REMINDER_NOT_FOUND'
};

export class ReminderNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.type = types.REMINDER_NOT_FOUND
  }
}
