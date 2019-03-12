module.exports = (() => {
  const express = require('express');
  const router = express.Router();
  const { CourseService, SessionService, AuthService } = require('../services');
  const { UserModelEnum } = require('../models');
  const { RemindersPopulator } = require('../populators');
  const { userAuthenticatorFactory } = AuthService;

  router.get(
    '/',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      const { currentUser } = req;
      CourseService.findAllCoursesForCurrentUser(currentUser)
        .then(courses => {
          courses = courses.map(course => {
            const instructors = course.instructors.map(instructor => {
              const { firstname, lastname, email } = instructor;
              return { id: instructor._id, firstname, lastname, email };
            });
            return { id: course._id, name: course.name, instructors };
          });
          res.send(courses);
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
          const {
            name,
            endDate,
            description,
            hasPlanningPrompt,
            planningPrompt
          } = course;
          let instructors = [];
          if (course.instructors) {
            instructors = course.instructors.map(instructor => {
              const { firstname, lastname, email } = instructor;
              return {
                id: instructor._id,
                firstname,
                lastname,
                email
              };
            });
          }
          res.send({
            id,
            name,
            description,
            endDate,
            instructors,
            hasPlanningPrompt,
            planningPrompt
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
        .then(result => {
          const id = result._id;
          res.send({
            id,
            name,
            description,
            endDate,
            instructors: instructors.map(instructor => {
              return {
                id: instructor._id,
                firstname: instructor.firstname,
                lastname: instructor.lastname,
                email: instructor.email
              };
            })
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

  return router;
})();
