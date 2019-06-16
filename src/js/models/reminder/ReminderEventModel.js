import mongoose, { Schema, model } from 'mongoose';
import { castObjectId } from '../../utils/UtilityFunctions';
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

ReminderEventSchema.statics.deleteReminderEvents = function (ids) {
  const eventIds = _.map(ids, castObjectId);
  this.find({ _id: { $in: eventIds } }).then(events => {
    const notificationIds = _.flatten(_.map(events, event => event.notifications)).map(notification => notification._id);
    model('ReminderNotificationModel').deleteReminderNotifications(notificationIds);
  });
  return this.deleteMany({ _id: { $in: eventIds } }).exec();
}

export default model('ReminderEventModel', ReminderEventSchema);
