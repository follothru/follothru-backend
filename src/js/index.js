import ReminderController from "./controllers/reminder/ReminderController";
import express from 'express';
import configDatabase from "./configDatabase";
import { port } from "./config";

const app = express();

configDatabase();

app.use(express.json());

app.use('/reminder', ReminderController);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
