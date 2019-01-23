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
            const id = instructor._id;
            const { firstname, lastname, email } = instructor;
            return { id, firstname, lastname, email };
          });
          res.send({ id, name, description, instructors });
        })
      )
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
