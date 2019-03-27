module.exports = (() => {
  const SessionService = require('./session.service.js');
  const { UserModelEnum } = require('../models');

  function checkUserPrivilege(req, res, next, requiredPrivileges) {
    SessionService.authenticateSession(req, res).then(currentUser => {
      // error checking
      if (!currentUser) {
        const error = 'You are not permitted to perform operation';
        res.status(403).send({ error });
        return;
      }
      req.currentUser = currentUser;
      const currentUserGroups = currentUser.groups;
      // if current user is super admin, pass it
      if (currentUserGroups.includes(UserModelEnum.UserGroup.SUPER_ADMIN)) {
        next();
      } else {
        const result = currentUserGroups.some(currentUserGroup =>
          requiredPrivileges.includes(currentUserGroup)
        );
        if (result) {
          next();
        } else {
          const error = 'You are not permitted to perform operation';
          res.status(403).send({ error });
          return;
        }
      }
    });
  }

  function userAuthenticatorFactory(requiredPrivileges) {
    return (req, res, next) =>
      checkUserPrivilege(req, res, next, requiredPrivileges);
  }

  return { checkUserPrivilege, userAuthenticatorFactory };
})();
