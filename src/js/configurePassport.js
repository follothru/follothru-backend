import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as UserService from './services/user/UserService';

export default function () {
  passport.use(new LocalStrategy((username, password, done) =>
    UserService.findUserByEmail(username)
      .then(user => {
        const success = user && user.password === password;
        return success ? done(null, user) : done(null, false, { message: 'Incorrect username or password.' });
      })
      .catch(done)
  ));
  return passport;
}
