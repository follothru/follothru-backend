module.exports = (() => {
  const express = require('express');
  const { CourseService } = require('../services');
  const router = express.Router();

  router.get('/', (req, res) => {
    CourseService.findAllCourses()
      .then(result => res.send(result))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.post('/', (req, res) => {
    const { name, description, instructors } = req.body;
    CourseService.createCourse(name, description, instructors)
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  return router;
})();
