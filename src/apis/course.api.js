module.exports = (() => {
  const express = require('express');
  const { CourseService, ReminderService } = require('../services');
  const router = express.Router();

  router.get('/', (req, res) => {
    CourseService.findAllCourses()
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

  router.get('/:id', (req, res) => {
    const id = req.params.id;
    CourseService.findCourseById(id)
      .then(course => {
        if (!course) {
          throw 'Could not find course';
        }
        const { instructors, name, description } = course;
        res.send({ id, name, description, instructors });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { name, description, endDate } = req.body;
    CourseService.modifyCourse(id, name, description, endDate)
      .then(() => res.send({ id }))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.get('/:courseId/reminder', (req, res) => {
    const { courseId } = req.params;
    ReminderService.findRemindersByCourseId(courseId)
      .then(reminders => res.send(reminders))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.post('/', (req, res) => {
    const { name, description, instructors } = req.body;
    CourseService.createCourse(name, description, instructors)
      .then(result => {
        res.send({ id: result._id });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  return router;
})();
