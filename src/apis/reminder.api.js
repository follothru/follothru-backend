module.exports = (() => {
  const express = require('express');
  const { SessionService } = require('../services');

  const router = express.Router();

  router.delete('/:reminderId', SessionService.authenticateSession, () => {
    //todo
  });

  return router;
})();
