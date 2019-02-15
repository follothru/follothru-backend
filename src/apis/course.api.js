module.exports = (() => {
  const express = require('express');
  const { CourseService } = require('../services');
  const router = express.Router();

  router.get('/', (req, res) => {
    CourseService.findAllCourses()
      .then(courses =>
        courses.map(course => {
          const id = course._id;
          const name = course.name;
          const description = course.description;
          const instructors = course.instructors.map(instructor => {
            const instructorId = instructor._id;
            const { firstname, lastname, email } = instructor;
            return { id: instructorId, firstname, lastname, email };
          });
          return { id, name, description, instructors };
        })
      )
      .then(courses => res.send(courses))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.get('/:id', (req, res) => {
    const id = req.params.id;
    CourseService.findCourseById(id)
      .then(courses => {
        courses = courses.map(course => {
          const id = course._id;
          const { instructors, students, name, description } = course;
          return { id, instructors, name, description, students };
        });
        res.send(courses[0]);
      })
      .catch(err => {
        console.log(err);
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
