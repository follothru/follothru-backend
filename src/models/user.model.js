module.exports = (() => {
  const mongoose = require('mongoose');

  const UserGroup = {
    ANONYMOUS: 0,
    INSTRUCTOR: 1,
    ADMIN: 2,
    SUPERADMIN: 3
  };

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
