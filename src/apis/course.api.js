module.exports = (() => {
  const express = require('express');
  const router = express.Router();
  const { CourseService, AuthService } = require('../services');
  const { UserModelEnum } = require('../models');
  const { userAuthenticatorFactory } = AuthService;
  const {
    CoursePopulator,
    CoursesPopulator,
    StudentsPopulator,
    RemindersPopulator
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

  router.get('/:id/enrollInfo', (req, res) => {
    const id = req.params.id;
    CourseService.findCourseById(id)
      .then(course => {
        if (!course) {
          throw new Error('Could not find course');
        }
        res.send(CoursePopulator.populatePublicFields(course));
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({
          error: err.message
        });
      });
  });

  router.put(
    '/:id',
    userAuthenticatorFactory([UserModelEnum.UserGroup.ADMIN]),
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
    userAuthenticatorFactory([UserModelEnum.UserGroup.ADMIN]),
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

  router.put(
    '/:courseId/approve',
    userAuthenticatorFactory([UserModelEnum.UserGroup.ADMIN]),
    (req, res) => {
      const { courseId } = req.params;
      CourseService.approveCourse(courseId)
        .then(() => {
          res.send({
            id: courseId,
            message: 'Success'
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

  router.get('/:courseId/validateEnroll', (req, res) => {
    const { courseId } = req.params;
    const { email } = req.query;
    CourseService.validateEnroll(courseId, email)
      .then(() => res.send({ result: true, message: 'success' }))
      .catch(err => {
        console.error(err);
        if (
          err instanceof CourseService.Errors.EmailAlreadyRegisteredError ||
          err instanceof CourseService.Errors.EmailNotVerifiedError
        ) {
          res.send({ result: false, code: err.type, message: err.message });
          return;
        }
        res.status(500).send({ message: err.message });
      });
  });

  router.get('/:courseId/student/:studentId/enrollStatus', (req, res) => {
    const { courseId, studentId } = req.params;
    CourseService.getStudentEnrollStatus(courseId, studentId)
      .then(result =>
        res.send({ verified: result.verified, email: result.email })
      )
      .catch(err => {
        console.error(err);
        res.status(500).send({
          message: err.message
        });
      });
  });

  router.post('/:courseId/student', (req, res) => {
    const { courseId } = req.params;
    const { prefName, email } = req.body;
    CourseService.studentEnroll(courseId, prefName, email)
      .then(result =>
        res.send({ studentId: result.studentId, courseId: result.courseId })
      )
      .catch(err => {
        console.error(err);
        if (
          err instanceof CourseService.Errors.EmailAlreadyRegisteredError ||
          err instanceof CourseService.Errors.EmailNotVerifiedError
        ) {
          res.status(400).send({
            message: err.message,
            type: err.type
          });
          return;
        }
        res.status(500).send({
          message: err.message
        });
      });
  });

  router.delete(
    '/:courseId/student/:studentId',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.SUPER_ADMIN,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      const { courseId, studentId } = req.params;
      CourseService.removeStudent(courseId, studentId)
        .then(() => {
          res.send({ message: 'Success' });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send({ error: err.message });
        });
    }
  );

  return router;
})();
