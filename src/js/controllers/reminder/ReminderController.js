import express from 'express';
import { populateReminders, populateReminder } from '../../common/populators/reminder/ReminderPopulator';
import { types as errorTypes } from '../../common/errors';
import * as ReminderService from '../../services/reminder/ReminderService';

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

router.get('/', (req, res) => {
  ReminderService.getReminders()
    .then(reminders => res.send(populateReminders(reminders)))
    .catch(err => handleErrorResponse(err, res));
});

router.get('/:reminderId', (req, res) => {
  const { reminderId } = req.params;
  ReminderService.getReminderById(reminderId)
    .then(reminder => res.send(populateReminder(reminder)))
    .catch(err => handleErrorResponse(err, res));
});

router.post('/', (req, res) => {
  const { name, message, startDate, endDate, repeats, offsets } = req.body;
  ReminderService.createReminder(name, message, new Date(startDate), new Date(endDate), repeats, offsets)
    .then(reminder => res.send(populateReminder(reminder)))
    .catch(err => handleErrorResponse(err, res));
});

router.delete('/:reminderId', (req, res) => {
  const { reminderId } = req.params;
  ReminderService.deleteReminder(reminderId)
    .then(() => res.end())
    .catch(err => handleErrorResponse(err, res));
});

export default router;
