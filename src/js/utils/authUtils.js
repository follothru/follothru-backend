import jwt from 'jsonwebtoken';
import { secretKey } from '../config';
import _ from 'lodash';

export const sign = (req, res, next) => {
  const { user } = req;
  const userNoPwd = Object.assign({}, user.toJSON(), { password: null });
  jwt.sign({ user: userNoPwd }, secretKey, { expiresIn: '1d' }, (err, token) => {
    if (err) {
      console.error(err);
      res.status(403).send({ message: 'Failed to create user token.' });
      return;
    }
    user.token = token;
    next();
  });
};

const verify = (required) => (req, res, next) => {
  const { authorization } = req.headers;
  const token = _.split(authorization, "Bearer ")[1];
  jwt.verify(token, secretKey, (err, authData) => {
    if (err && required) {
      console.error(err);
      res.status(403).send({ message: 'Failed to verify user token.' });
      return;
    }
    req.user = authData ? authData.user : null;
    next();
  });
};

export const required = verify(true);

export const optional = verify(false);
