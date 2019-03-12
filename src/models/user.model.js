module.exports = (() => {
  const mongoose = require('mongoose');
  const UserModelEnum = require('./user.model.enum.js');

  const UserGroup = UserModelEnum.UserGroup;

  const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: String,
    lastname: String,
    password: String,
    email: String,
    groups: [{ type: Number, enum: UserGroup }]
  });

  UserSchema.virtual('UserGroup').get(() => UserGroup);

  return mongoose.model('UserModel', UserSchema);
})();
