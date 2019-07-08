import express from 'express';
import { populateReminders, populateReminder } from '../../common/populators/reminder/ReminderPopulators';
import { types as errorTypes } from '../../common/errors';
import { types as reminderErrorTypes } from '../../services/reminder/errors';
import * as ReminderService from '../../services/reminder/ReminderService';
import * as auth from '../../utils/authUtils';

const router = express.Router();

const handleErrorResponse = (error, res) => {
  const { type, message } = error;
  let status = 500;

  switch (type) {
    case errorTypes.PARAMETER_EMPTY_ERROR:
    case errorTypes.INVALID_PARAMETER_ERROR:
      status = 400;
      break;

    case errorTypes.DOCUMENT_NOT_FOUND_ERROR:
    case reminderErrorTypes.REMINDER_NOT_FOUND:
      status = 404;
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

router.get('/:reminderId', auth.required, (req, res) => {
  const { reminderId } = req.params;
  ReminderService.getReminderById(reminderId)
    .then(reminder => res.send(populateReminder(reminder)))
    .catch(err => handleErrorResponse(err, res));
});

router.delete('/:reminderId', auth.required, (req, res) => {
  const { reminderId } = req.params;
  ReminderService.deleteReminder(reminderId)
    .then(() => res.end())
    .catch(err => handleErrorResponse(err, res));
});

export default router;
