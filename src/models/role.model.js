const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
  name: String
});

module.exports = mongoose.model('RoleModel', roleSchema);
