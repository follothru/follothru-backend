import { Schema, model } from 'mongoose';
import { castObjectId } from '../../utils/UtilityFunctions';
import _ from 'lodash';

const ReminderNotificationSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  dateTime: Date
});

ReminderNotificationSchema.statics.deleteReminderNotifications = function (ids) {
  const notificationIds = _.map(ids, castObjectId);
  return this.deleteMany({ _id: { $in: notificationIds } }).exec();
}

export default model('ReminderNotificationModel', ReminderNotificationSchema);
