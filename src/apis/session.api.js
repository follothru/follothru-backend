module.exports = (() => {
  const express = require('express');
  const router = express.Router();
  const { SessionService } = require('../services');

  /**
   * Validate session
   */
  router.get('/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    SessionService.validateUserSession(sessionId)
      .then(result => {
        const id = result._id;
        const { user, creationTime } = result;

        const userId = user._id;
        const { firstname, lastname, email } = user;
        res.send({
          id,
          creationTime,
          user: {
            userId,
            firstname,
            lastname,
            email
          }
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  /**
   * Endpoint for creating user session
   */
  router.post('/', (req, res) => {
    const { username, password } = req.body;
    SessionService.createUserSession(username, password)
      .then(result => {
        const id = result._id;
        const { creationTime, user } = result;

        const userId = user._id;
        const { firstname, lastname, email } = user;

        res.send({
          id,
          creationTime,
          user: {
            userId,
            firstname,
            lastname,
            email
          }
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  return router;
})();
