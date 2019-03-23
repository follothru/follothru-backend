module.exports = (() => {
  function populate(user) {
    if (!user) {
      return null;
    }
    const UserGroupsPopulator = require('./user-groups.populator.js');
    const { firstname, lastname, email, groups } = user;
    return {
      id: user._id,
      firstname,
      lastname,
      email,
      groups: UserGroupsPopulator.populate(groups)
    };
  }

  return { populate };
})();
