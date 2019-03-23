module.exports = (() => {
  function populate(userGroup) {
    if (!userGroup) {
      return null;
    }
    const { UserGroup } = require('../models/user.model.enum.js');
    return UserGroup.toString(userGroup);
  }

  return { populate };
})();
