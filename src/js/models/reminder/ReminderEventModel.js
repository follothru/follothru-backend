import mongoose, { Schema, model } from 'mongoose';
import _ from 'lodash';

const ReminderEventSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  dateTime: Date,
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReminderNotificationModel' }]
});

ReminderEventSchema.methods.setNotifications = function (notifications) {
  const ids = _.map(notifications, notification => notification._id);
  this.notifications = ids;
}

export default model('ReminderEventModel', ReminderEventSchema);
