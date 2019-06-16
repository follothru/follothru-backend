import { Schema, model } from 'mongoose';

const ReminderNotificationSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  dateTime: Date
});

export default model('ReminderNotificationModel', ReminderNotificationSchema);
