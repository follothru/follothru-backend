module.exports = (() => {
  const express = require('express');
  const router = express.Router();
  const { StudentService, AuthService } = require('../services');
  const { userAuthenticatorFactory } = AuthService;
  const { UserModelEnum } = require('../models');

  router.get(
    '/',
    userAuthenticatorFactory([
      UserModelEnum.UserGroup.INSTRUCTOR,
      UserModelEnum.UserGroup.ADMIN
    ]),
    (req, res) => {
      StudentService.findAllStudents()
        .then(students =>
          students.map(student => {
            const id = student._id;
            const { prefName, email } = student;
            let courses = student.courses;
            courses = courses.map(course => {
              const id = course._id;
              const { name } = course;
              return { id, name };
            });
            return { id, prefName, email, courses };
          })
        )
        .then(students => res.send(students))
        .catch(err => {
          console.error(err);
          res.status(500).send(err);
        });
    }
  );

  router.post('/', (req, res) => {
    const { prefName, email, coursesToEnroll } = req.body;
    StudentService.createNewStudent(prefName, email, coursesToEnroll)
      .then(newCourse => res.send({ id: newCourse._id }))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  return router;
})();
