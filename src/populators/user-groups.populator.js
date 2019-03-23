module.exports = (() => {
  function populate(userGroups) {
    if (!userGroups) {
      return [];
    }
    const UserGroupPopulator = require('./user-group.populator.js');
    return userGroups.map(g => UserGroupPopulator.populate(g));
  }

  return { populate };
})();
