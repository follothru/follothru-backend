module.exports = (() => {
  const SessionService = require('../services/session.service.js');

  function authenticateSession(req, res, next) {
    const { authorization } = req.headers;
    SessionService.validateUserSession(authorization)
      .then(result => {
        req.currentUser = result.user;
        next();
      })
      .catch(() => res.status(403).send());
  }

  return { authenticateSession };
})();
