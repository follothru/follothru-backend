import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  preferName: String,
  email: String,
  password: String
});

UserSchema.statics.findUserById = function (id) {
  const userId = castObjectId(id);
  return this.findById(userId);
}

UserSchema.statics.findUserByEmail = function (email) {
  return this.findOne({ email });
}

export default model('UserModel', UserSchema);
