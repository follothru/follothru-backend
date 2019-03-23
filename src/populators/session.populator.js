module.exports = (() => {
  function populate(session) {
    if (!session) {
      return null;
    }

    const UserPopulator = require('./user.populator.js');
    const id = session._id;
    const { user, creationTime } = session;
    return {
      id,
      creationTime,
      user: UserPopulator.populate(user)
    };
  }

  return { populate };
})();
