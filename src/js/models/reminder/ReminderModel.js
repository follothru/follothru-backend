import { Schema, model } from 'mongoose';
import { castObjectId } from '../../utils/UtilityFunctions';
import _ from 'lodash';

const ReminderSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: String,
  startDate: Date,
  message: String,
  events: [{ type: Schema.Types.ObjectId, ref: 'ReminderNotificationModel' }]
});

ReminderSchema.methods.setEvents = function (events) {
  const eventIds = _.map(events, event => event._id);
  this.events = eventIds;
}

ReminderSchema.statics.findReminderById = function (id) {
  return this.findById(castObjectId(id));
}

ReminderSchema.statics.deleteReminderById = function (id) {
  return this.deleteOne({ _id: castObjectId(id) });
}

export default model('ReminderModel', ReminderSchema);
