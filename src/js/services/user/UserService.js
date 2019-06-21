import { notEmpty, isEmail } from "../../utils/ValidationUtils";
import UserModel from "../../models/user/UserModel";
import { castObjectId } from "../../utils/UtilityFunctions";

export function findUserById(id) {
  return UserModel.findUserById(id);
}

export function createNewUser(preferName, email, password) {
  return new Promise((resolve, reject) => {
    try {
      notEmpty(preferName, 'preferName');
      notEmpty(password, 'password');
      isEmail(email);

      UserModel.findUserByEmail(email).then(user => {
        if (user) {
          throw new Error(`User with email address '${email}' already existed.`);
        }
        const newUser = new UserModel({ preferName, email, password });
        return newUser.save();
      })
        .then(resolve)
        .catch(reject);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

export function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    try {
      isEmail(email);

      UserModel.findUserByEmail(email)
        .then(resolve)
        .catch(reject);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

export function addOwnedCourseToUser(userId, courseId) {
  return new Promise((resolve, reject) => {
    try {
      notEmpty(userId, 'userId');
      notEmpty(courseId, 'courseId');

      userId = castObjectId(userId);
      courseId = castObjectId(courseId);
      UserModel.updateOne({ _id: userId }, { $push: { ownedCourses: courseId } })
        .then(resolve)
        .catch(reject);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
