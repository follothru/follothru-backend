module.exports = (() => {
  const express = require('express');
  const router = express.Router();
  const { UserService, AuthService } = require('../services');
  const { UserModelEnum } = require('../models');
  const { userAuthenticatorFactory } = AuthService;
  const { UsersPopulator } = require('../populators');

  router.get('/', (req, res) => {
    const { ids } = req.body;
    const promise =
      ids && ids.length > 0
        ? UserService.findUsersByIds(ids)
        : UserService.findAllUsers();
    promise
      .then(users => res.send(UsersPopulator.populate(users)))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.post('/', (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    UserService.createUser(firstname, lastname, email, password)
      .then(result => {
        res.send({ id: result._id });
      })
      .catch(err => {
        console.error(err);
        const { message } = err;
        let status = 500;
        if (err instanceof UserService.Errors.DuplicatedUserError) {
          status = 400;
        }
        res.status(status).send({ status, message });
      });
  });

  router.put(
    '/:userId/assignAdmin',
    userAuthenticatorFactory([UserModelEnum.UserGroup.SUPER_ADMIN]),
    (req, res) => {
      const userId = req.params.userId;
      UserService.assignAdmin(userId)
        .then(message => {
          res.send({ message });
        })
        .catch(err => {
          console.error(err);
          const error = 'failed to assign admin';
          res.status(500).send({ error });
        });
    }
  );

  router.put(
    '/:userId/removeAdmin',
    userAuthenticatorFactory([UserModelEnum.UserGroup.SUPER_ADMIN]),
    (req, res) => {
      const userId = req.params.userId;
      UserService.removeAdmin(userId)
        .then(() => {
          const message = 'successfully removed admin privilege from user';
          res.send({ message });
        })
        .catch(err => {
          console.error(err);
          const error = 'failed to remove admin privilege from user';
          res.status(500).send({ error });
        });
    }
  );

  router.delete(
    '/:userId',
    userAuthenticatorFactory([UserModelEnum.UserGroup.SUPER_ADMIN]),
    (req, res) => {
      const userId = req.params.userId;
      UserService.deleteUser(userId)
        .then(() => {
          const message = 'successfully deleted';
          res.send({ message });
        })
        .catch(err => {
          console.error(err);
          const error = 'failed to delete user';
          res.status(500).send({ error });
        });
    }
  );

  return router;
})();
