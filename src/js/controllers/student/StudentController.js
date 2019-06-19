import express from 'express';
import { populateStudent } from '../../common/populators/student/StudentPopulators';
import { types as errorTypes } from '../../common/errors';
import * as StudentService from '../../services/student/StudentService';

const router = express.Router();

const handleErrorResponse = (error, res) => {
  const { type, message } = error;
  let status = 500;

  switch (type) {
    case errorTypes.PARAMETER_EMPTY_ERROR:
    case errorTypes.INVALID_PARAMETER_ERROR:
      status = 400;
      break;

    default:
      break;
  }

  res.status(status).send({
    error: {
      code: type,
      message
    }
  });
  console.error(error);
};

router.post('/', (req, res) => {
  const { preferName, email } = req.body;
  StudentService.register(preferName, email)
    .then(student => res.send(populateStudent(student)))
    .catch(err => handleErrorResponse(err, res));
});

export default router;
