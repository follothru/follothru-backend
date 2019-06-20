import express from 'express';
import { types as errorTypes } from '../../common/errors';
import { types as userErrorTypes } from '../../services/user/errors';
import { populateUser } from '../../common/populators/user/UserPopulators';
import passport from 'passport';
import * as auth from '../../utils/authUtils';
import * as UserService from '../../services/user/UserService';

const router = express.Router();

const handleErrorResponse = (error, res) => {
  const { type, message } = error;
  let status = 500;

  switch (type) {
    case errorTypes.PARAMETER_EMPTY_ERROR:
    case errorTypes.INVALID_PARAMETER_ERROR:
    case userErrorTypes.USER_ALREADY_EXISTED:
      status = 400;
      break;

    default:
      break;
  }

  res.status(status).send({
    error: {
      code: type,
      message
    }
  });
  console.error(error);
};

router.post('/', auth.optional, (req, res) => {
  const { preferName, email, password } = req.body;
  UserService.createNewUser(preferName, email, password)
    .then(user => res.send(populateUser(user)))
    .catch(err => handleErrorResponse(err, res));
});

router.post('/login', passport.authenticate('local', { session: false }), auth.sign,
  (req, res) => {
    const { token } = req.user;
    res.send({ message: 'Log in success', token });
  });

export default router;
