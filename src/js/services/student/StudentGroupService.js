import { notEmpty } from "../../utils/ValidationUtils";
import StudentGroupModel from "../../models/student/StudentGroupModel";
import { castObjectId } from "../../utils/UtilityFunctions";
import { StudentGroupNotFound } from "./errors";

export function findStudentGroupById(studentGroupId) {
  return new Promise((resolve, reject) => {
    try {
      notEmpty(studentGroupId, 'studentGroupId');

      StudentGroupModel.findById({ _id: castObjectId(studentGroupId) })
        .populate({
          path: 'students',
          model: 'StudentModel'
        })
        .then(studentGroup => {
          if (!studentGroup) {
            throw new StudentGroupNotFound(`Could not find student group with id '${studentGroupId}'`);
          }
          resolve(studentGroup);
        })
        .catch(reject);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

export function addStudentToStudentGroup(studentId, studentGroupId) {
  return new Promise((resolve, reject) => {
    try {
      notEmpty(studentId, 'studentId');
      notEmpty(studentGroupId, 'studentGroupId');

      StudentGroupModel.updateOne({ _id: castObjectId(studentGroupId) }, { $push: { students: castObjectId(studentId) } })
        .then(resolve)
        .catch(reject);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
