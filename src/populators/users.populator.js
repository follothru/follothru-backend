module.exports = (() => {
  function populate(users) {
    if (!users) {
      return [];
    }
    const UserPopulator = require('./user.populator.js');
    return users.map(user => UserPopulator.populate(user));
  }

  return { populate };
})();
