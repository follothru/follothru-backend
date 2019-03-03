module.exports = (() => {
  const express = require('express');
  const { CourseService, SessionService } = require('../services');
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
        const {
          name,
          endDate,
          description,
          planningPrompt,
          hasPlanningPrompt
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
        res.status(500).send(err);
      });
  });

  router.put('/:id', SessionService.authenticateSession, (req, res) => {
    const courseId = req.params.id;
    const {
      name,
      description,
      endDate,
      hasPlanningPrompt,
      planningPrompt
    } = req.body;
    CourseService.modifyCourse({
      courseId,
      name,
      description,
      endDate,
      hasPlanningPrompt,
      planningPrompt
    })
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
      CourseService.getReminders(courseId)
        .then(reminders => {
          reminders = reminders.map(reminder => {
            const { name, startDate, endDate } = reminder;
            let actions = [];
            if (reminder.actions) {
              actions = reminder.actions.map(action => {
                return { name: action.name, dateTime: action.dateTime };
              });
            }
            return { id: reminder._id, name, startDate, endDate, actions };
          });
          res.send(reminders);
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err);
        });
    }
  );

  router.post(
    '/:courseId/reminder',
    SessionService.authenticateSession,
    (req, res) => {
      const { courseId } = req.params;
      const { name, startDate, endDate, repeats } = req.body;
      CourseService.createReminders(courseId, name, startDate, endDate, repeats)
        .then(reminder => {
          res.send({
            id: reminder._id
          });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err);
        });
    }
  );

  router.post('/', SessionService.authenticateSession, (req, res) => {
    const {
      name,
      description,
      endDate,
      hasPlanningPrompt,
      planningPrompt
    } = req.body;
    const instructors = [req.currentUser];
    CourseService.createCourse({
      name,
      description,
      endDate,
      instructors,
      hasPlanningPrompt,
      planningPrompt
    })
      .then(result => {
        const id = result._id;
        res.send({
          id,
          name,
          description,
          endDate,
          instructors,
          planningPrompt
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
