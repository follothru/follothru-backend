import CourseModel from "../../models/course/CourseModel";
import { notEmpty } from "../../utils/ValidationUtils";
import { castObjectId } from "../../utils/UtilityFunctions";
import { CourseNotFoundError } from "./errors";
import _ from 'lodash';
import * as ReminderService from "../reminder/ReminderService";
import * as StudentGroupService from "../student/StudentGroupService";
import * as UserService from "../user/UserService";

export function findAllCourses(userId) {
  return new Promise((resolve, reject) => {
    try {
      notEmpty(userId, "userId");

      UserService.findUserById(userId)
        .then(user => _.concat(user.ownedCourses, user.involvedCourses))
        .then(courseIds => CourseModel.find({ _id: { $in: courseIds } }))
        .then(resolve)
        .catch(reject);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

export function findCourseById(courseId) {
  return new Promise((resolve, reject) => {
    try {
      notEmpty(courseId, 'courseId');
      CourseModel.findById(castObjectId(courseId))
        .then(course => {
          if (!course) {
            throw new CourseNotFoundError(`Could not find course with id '${courseId}'`);
          }
          resolve(course);
        })
        .catch(reject);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

export function createCourse(name, userId) {
  return new Promise((resolve, reject) => {
    try {
      notEmpty(name, 'name');
      const newCourse = new CourseModel({ name });
      newCourse.save()
        .then(course =>
          UserService.addOwnedCourseToUser(userId, course._id)
            .then(() => course)
        )
        .then(resolve)
        .catch(reject);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

export function createReminderForCourse(courseId, name, message, startDate, endDate, repeats, offsets, meta) {
  return ReminderService.createReminder(courseId, name, message, startDate, endDate, repeats, offsets, meta);
}

export function deleteCourseById(courseId) {
  return new Promise((resolve, reject) => {
    try {
      notEmpty(courseId, 'courseId');
      CourseModel.deleteCourseById(courseId).then(resolve).catch(reject);
    }
    catch (err) {
      console.error(err);
      reject(err);
    }
  });
}


export function studentEnroll(courseId, studentId) {
  return new Promise((resolve, reject) => {
    try {
      notEmpty(courseId, 'courseId');
      notEmpty(studentId, 'studentId');

      findCourseById(courseId)
        .then(course => {
          const { studentGroup } = course;
          return StudentGroupService.addStudentToStudentGroup(studentId, studentGroup);
        })
        .then(resolve)
        .catch(reject);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

export function getRemindersForCourse(courseId) {
  return new Promise((resolve, reject) => {
    try {
      notEmpty(courseId, 'courseId');

      ReminderService.getRemindersForCourse(courseId)
        .then(resolve)
        .catch(reject);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
