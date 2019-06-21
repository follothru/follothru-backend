import { Schema, model } from "mongoose";
import { castObjectId } from "../../utils/UtilityFunctions";

const UserSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  preferName: String,
  email: String,
  password: String,
  ownedCourses: [{ type: Schema.Types.ObjectId, ref: 'CourseModel' }],
  involvedCourses: [{ type: Schema.Types.ObjectId, ref: 'CourseModel' }]
});

UserSchema.statics.findUserById = function (id) {
  const userId = castObjectId(id);
  return this.findById(userId);
}

UserSchema.statics.findUserByEmail = function (email) {
  return this.findOne({ email });
}

export default model('UserModel', UserSchema);
