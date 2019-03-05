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
        res.status(500).send({
          error: err.message
        });
      });
  });

  router.get('/:id', SessionService.authenticateSession, (req, res) => {
    const id = req.params.id;
    CourseService.findCourseById(id)
      .then(course => {
        if (!course) {
          throw new Error('Could not find course');
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
        res.status(500).send({
          error: err.message
        });
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
        res.status(500).send({
          error: err.message
        });
      });
  });

  router.get(
    '/:courseId/reminder',
    SessionService.authenticateSession,
    (req, res) => {
      const { courseId } = req.params;
      CourseService.getRemindersByCourseId(courseId)
        .then(results => {
          results = results.map(result => {
            const { name, events, activities } = result;
            return {
              id: result._id,
              name,
              events: events.map(event => {
                let subreminder = null;
                if (event.subreminder) {
                  subreminder = {
                    id: event.subreminder._id,
                    name: event.subreminder.name,
                    dateTime: event.subreminder.dateTime
                  };
                }
                return {
                  id: event._id,
                  name: event.name,
                  dateTime: event.dateTime,
                  subreminder: subreminder
                };
              }),
              activities: activities.map(activity => {
                let subreminder = null;
                if (activity.subreminder) {
                  subreminder = {
                    id: activity.subreminder._id,
                    name: activity.subreminder.name,
                    dateTime: activity.subreminder.dateTime
                  };
                }
                return {
                  id: activity._id,
                  name: activity.name,
                  dateTime: activity.dateTime,
                  subreminder
                };
              })
            };
          });
          res.send(results);
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
    '/:courseId/reminder',
    SessionService.authenticateSession,
    (req, res) => {
      const { courseId } = req.params;
      const { name, startDate, endDate, repeats, type } = req.body;
      CourseService.createReminders(
        courseId,
        name,
        type,
        startDate,
        endDate,
        repeats
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
  });

  router.delete(
    '/:courseId',
    SessionService.authenticateSession,
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
