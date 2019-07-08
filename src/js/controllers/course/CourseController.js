import express from 'express';
import { populateCourse, populateCourses } from '../../common/populators/course/CoursePopulators';
import { populateReminder, populateReminders } from '../../common/populators/reminder/ReminderPopulators';
import { types as courseErrorTypes } from '../../services/course/errors';
import { types as errorTypes } from '../../common/errors';
import * as CourseService from '../../services/course/CourseService';
import * as auth from '../../utils/authUtils';

const router = express.Router();

const handleErrorResponse = (error, res) => {
  const { type, message } = error;
  let status = 500;

  switch (type) {
    case errorTypes.PARAMETER_EMPTY_ERROR:
    case errorTypes.INVALID_PARAMETER_ERROR:
      status = 400;
      break;

    case courseErrorTypes.COURSE_NOT_FOUND:
      status = 404;
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

router.get('/', auth.required, (req, res) => {
  const { _id } = req.user;
  CourseService.findAllCourses(_id)
    .then(courses => res.send(populateCourses(courses)))
    .catch(err => handleErrorResponse(err, res));
});

router.post('/', auth.required, (req, res) => {
  const { name } = req.body;
  const { _id } = req.user;
  CourseService.createCourse(name, _id)
    .then(newCourse => res.send(populateCourse(newCourse)))
    .catch(err => handleErrorResponse(err, res));
});

router.get('/:courseId', auth.required, (req, res) => {
  const { courseId } = req.params;
  CourseService.findCourseById(courseId)
    .then(course => res.send(populateCourse(course)))
    .catch(err => handleErrorResponse(err, res));
});

router.delete('/:courseId', auth.required, (req, res) => {
  const { courseId } = req.params;
  CourseService.deleteCourseById(courseId)
    .then(() => res.send())
    .catch(err => handleErrorResponse(err, res));
});

router.get('/:courseId/reminder', auth.required, (req, res) => {
  const { courseId } = req.params;
  CourseService.getRemindersForCourse(courseId)
    .then(reminders => res.send(populateReminders(reminders)))
    .catch(err => handleErrorResponse(err, res));
});

router.post('/:courseId/reminder', auth.required, (req, res) => {
  const { courseId } = req.params;
  const { name, message, startDate, endDate, repeats, offsets, meta } = req.body;
  CourseService.createReminderForCourse(courseId, name, message, new Date(startDate), new Date(endDate), repeats, offsets, meta)
    .then(reminder => res.send(populateReminder(reminder)))
    .catch(err => handleErrorResponse(err, res));
});

router.put('/:courseId/student', auth.optional, (req, res) => {
  const { courseId } = req.params;
  const { studentId } = req.body;
  CourseService.studentEnroll(courseId, studentId)
    .then(() => res.end())
    .catch(err => handleErrorResponse(err, res));
});

export default router;
