module.exports = (() => {
  const express = require('express');
  const { UserService } = require('../services');
  const router = express.Router();

  router.get('/', (req, res) => {
    const { ids } = req.body;
    let promise;
    if (ids && ids.length > 0) {
      promise = UserService.findUsersByIds(ids);
    } else {
      promise = UserService.findAllUsers().then(userModels =>
        userModels.map(userModel => {
          const id = userModel._id;
          const { firstname, lastname, email, groups } = userModel;
          return { id, firstname, lastname, email, groups };
        })
      );
    }
    promise
      .then(result => res.send(result))
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

  return router;
})();
