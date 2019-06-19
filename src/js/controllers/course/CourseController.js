import express from 'express';
import { populateCourse, populateCourses } from '../../common/populators/course/CoursePopulators';
import { populateReminder } from '../../common/populators/reminder/ReminderPopulators';
import { types as courseErrorTypes } from '../../services/course/errors';
import { types as errorTypes } from '../../common/errors';
import * as CourseService from '../../services/course/CourseService';

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

router.get('/', (req, res) => {
  CourseService.findAllCourses()
    .then(courses => res.send(populateCourses(courses)))
    .catch(err => handleErrorResponse(err, res));
});

router.post('/', (req, res) => {
  const { name } = req.body;
  CourseService.createCourse(name)
    .then(newCourse => res.send(populateCourse(newCourse)))
    .catch(err => handleErrorResponse(err, res));
});

router.delete('/:courseId', (req, res) => {
  const { courseId } = req.params;
  CourseService.deleteCourseById(courseId)
    .then(() => res.send())
    .catch(err => handleErrorResponse(err, res));
});

router.post('/:courseId/reminder', (req, res) => {
  const { courseId } = req.params;
  const { name, message, startDate, endDate, repeats, offsets, meta } = req.body;
  CourseService.createReminderForCourse(courseId, name, message, new Date(startDate), new Date(endDate), repeats, offsets, meta)
    .then(reminder => res.send(populateReminder(reminder)))
    .catch(err => handleErrorResponse(err, res));
});

router.put('/:courseId/student', (req, res) => {
  const { courseId } = req.params;
  const { studentId } = req.body;
  CourseService.studentEnroll(courseId, studentId)
    .then(() => res.end())
    .catch(err => handleErrorResponse(err, res));
});

export default router;