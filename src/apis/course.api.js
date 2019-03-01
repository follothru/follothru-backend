module.exports = (() => {
  const express = require('express');
  const {
    CourseService,
    ActivityService,
    EventService,
    SessionService
  } = require('../services');
  const router = express.Router();

  router.get('/', SessionService.authenticateSession, (req, res) => {
    const { currentUser } = req;
    CourseService.findAllCoursesForCurrentUser(currentUser)
      .then(courses => {
        courses = courses.map(course => {
          const id = course._id;
          const name = course.name;
          const description = course.description;
          const instructors = course.instructors.map(instructor => {
            const instructorId = instructor._id;
            const { firstname, lastname, email } = instructor;
            return { id: instructorId, firstname, lastname, email };
          });
          return { id, name, description, instructors };
        });
        res.send(courses);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.get('/:id', SessionService.authenticateSession, (req, res) => {
    const id = req.params.id;
    CourseService.findCourseById(id)
      .then(course => {
        if (!course) {
          throw 'Could not find course';
        }
        const { name, endDate, description } = course;
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
          instructors
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.put('/:id', SessionService.authenticateSession, (req, res) => {
    const id = req.params.id;
    const { name, description, endDate } = req.body;
    CourseService.modifyCourse(id, name, description, endDate)
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
        res.status(500).send(err);
      });
  });

  router.get(
    '/:courseId/reminder',
    SessionService.authenticateSession,
    (req, res) => {
      const { courseId } = req.params;
      var all = [];
      ActivityService.getRemindersByCourseId(courseId)
        .then(reminders => {
          all = all.concat(reminders);
          return EventService.getRemindersByCourseId(courseId);
        })
        .then(reminders => {
          all = all.concat(reminders);
          res.send(all).status(200);
        })
        .catch(err => {
          console.log(err);
          res.send(err).status(500);
        });
    }
  );

  router.post('/', SessionService.authenticateSession, (req, res) => {
    const { name, description, endDate } = req.body;
    const instructors = [req.currentUser];
    CourseService.createCourse(name, description, endDate, instructors)
      .then(result => {
        const id = result._id;
        res.send({
          id,
          name,
          description,
          endDate,
          instructors
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.delete(
    '/:courseId',
    SessionService.authenticateSession,
    (req, res) => {
      const { courseId } = req.params;
      CourseService.deleteCourse(courseId)
        .then(result => {
          res.send(result);
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err);
        });
    }
  );

  return router;
})();
