module.exports = (() => {
  const express = require('express');
  const router = express.Router();
  const { CourseService, AuthService } = require('../services');
  const { UserModelEnum } = require('../models');
  const { RemindersPopulator } = require('../populators');
  const { userAuthenticatorFactory } = AuthService;
  const {
    CoursePopulator,
    CoursesPopulator,
    StudentsPopulator
  } = require('../populators');

  router.get(
    '/',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      const { currentUser } = req;
      CourseService.findAllCoursesForUser(currentUser)
        .then(courses => res.send(CoursesPopulator.populate(courses)))
        .catch(err => {
          console.error(err);
          res.status(500).send({
            error: err.message
          });
        });
    }
  );

  router.get(
    '/:id',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      const id = req.params.id;
      CourseService.findCourseById(id)
        .then(course => {
          if (!course) {
            throw new Error('Could not find course');
          }
          res.send(CoursePopulator.populate(course));
        })
        .catch(err => {
          console.error(err);
          res.status(500).send({
            error: err.message
          });
        });
    }
  );

  router.put(
    '/:id',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.ADMIN,
      UserModelEnum.UserGroup.INSTRUCTOR
    ]),
    (req, res) => {
      const id = req.params.id;
      const {
        name,
        description,
        endDate,
        hasPlanningPrompt,
        planningPrompt
      } = req.body;
      CourseService.modifyCourse(
        id,
        name,
        description,
        endDate,
        hasPlanningPrompt,
        planningPrompt
      )
        .then(result =>
          res.send({
            id: result._id,
            name: result.name,
            description: result.description,
            endDate: result.endDate
          })
        )
        .catch(err => {
          console.error(err);
          res.status(500).send({
            error: err.message
          });
        });
    }
  );

  router.get(
    '/:courseId/reminder',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      const { courseId } = req.params;

      CourseService.getRemindersByCourseId(courseId)
        .then(reminders => RemindersPopulator.populate(reminders))
        .then(result => res.send(result))
        .catch(err => {
          console.error(err);
          res.status(500).send({
            error: err.message
          });
        });
    }
  );

  router.get(
    '/:courseId/reminder/:reminderId/subreminder/:subreminderId',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      const subreminderId = req.params.subreminderId;
      CourseService.getSubreminderById(subreminderId)
        .then(result => res.send(result))
        .catch(err => {
          res.status(500).send({ error: err.message });
        });
    }
  );

  // post a email for subreminder in reminder
  router.post(
    '/:courseId/reminder/:reminderId/subreminder/:subreminderId/email',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      const subreminderId = req.params.subreminderId;
      const { email } = req.body;
      CourseService.addEmailForSubreminder(subreminderId, email)
        .then(() =>
          res.send({
            message: 'success'
          })
        )
        .catch(err => {
          res.send({ error: err.message }).status(500);
        });
    }
  );

  // add a component to email
  router.post(
    '/:courseId/reminder/:reminderId/subreminder/:subreminderId/emailComponent',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      const subreminderId = req.params.subreminderId;
      const { components } = req.body;
      CourseService.addComponentsToEmail(subreminderId, components)
        .then(() =>
          res.send({
            message: 'success'
          })
        )
        .catch(err => {
          res.send({ error: err.message }).status(500);
        });
    }
  );

  router.post(
    '/:courseId/reminder',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      const { courseId } = req.params;
      const {
        name,
        startDateTime,
        endDateTime,
        repeats,
        sendTime,
        type
      } = req.body;
      CourseService.createReminders(
        courseId,
        name,
        type,
        startDateTime,
        endDateTime,
        repeats,
        sendTime
      )
        .then(reminder => {
          res.send({
            id: reminder._id
          });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send({
            error: err.message
          });
        });
    }
  );

  router.post(
    '/',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      const {
        name,
        description,
        endDate,
        hasPlanningPrompt,
        planningPrompt
      } = req.body;
      const instructors = [req.currentUser];
      CourseService.createCourse(
        name,
        description,
        endDate,
        instructors,
        hasPlanningPrompt,
        planningPrompt
      )
        .then(result => res.send(CoursePopulator.populate(result)))
        .catch(err => {
          console.error(err);
          res.status(500).send({
            error: err.message
          });
        });
    }
  );

  router.delete(
    '/:courseId',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      const { courseId } = req.params;
      CourseService.deleteCourse(courseId)
        .then(result => {
          res.send({
            n: result.n
          });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send({
            error: err.message
          });
        });
    }
  );

  router.get(
    '/:courseId/student',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.ADMIN,
      UserModelEnum.UserGroup.INSTRUCTOR
    ]),
    (req, res) => {
      const { courseId } = req.params;
      CourseService.getStudentsEnrolled(courseId)
        .then(result => res.send(StudentsPopulator.populate(result)))
        .catch(err => {
          console.error(err);
          res.status(500).send({
            error: err.message
          });
        });
    }
  );

  router.post('/:courseId/student', (req, res) => {
    const { courseId } = req.params;
    const { prefName, email } = req.body;
    CourseService.studentEnroll(courseId, prefName, email)
      .then(() => res.send({ message: 'Success' }))
      .catch(err => {
        console.error(err);
        res.status(500).send({
          error: err.message
        });
      });
  });

  return router;
})();
