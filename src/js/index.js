import ReminderController from "./controllers/reminder/ReminderController";
import CourseController from "./controllers/course/CourseController";
import StudentController from "./controllers/student/StudentController";
import express from 'express';
import cors from 'cors';
import configDatabase from "./configDatabase";
import { port } from "./config";

const app = express();

configDatabase();

app.use(express.json());
app.use(cors());

app.use('/reminder', ReminderController);

app.use('/course', CourseController);

app.use('/student', StudentController);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
