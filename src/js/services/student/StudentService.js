import { notEmpty, isEmail } from "../../utils/ValidationUtils";
import StudentModel from "../../models/student/StudentModel";

export function register(preferName, email) {
  return new Promise((resolve, reject) => {
    try {
      notEmpty(preferName, 'preferName');
      isEmail(email);

      const student = new StudentModel({ preferName, email });
      student.save().then(resolve).catch(reject);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
