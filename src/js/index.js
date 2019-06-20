import ReminderController from "./controllers/reminder/ReminderController";
import CourseController from "./controllers/course/CourseController";
import StudentController from "./controllers/student/StudentController";
import UserController from "./controllers/user/UserController";
import express from 'express';
import cors from 'cors';
import configDatabase from "./configDatabase";
import { port } from "./config";
import { getDatabaseReady } from "./utils/UtilityFunctions";
import configurePassport from "./configurePassport";

const app = express();

configDatabase();
const passport = configurePassport();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use((req, res, next) => {
  if (getDatabaseReady()) {
    next();
    return;
  }
  res.status(503).send();
});

app.use('/reminder', ReminderController);
app.use('/course', CourseController);
app.use('/student', StudentController);
app.use('/user', UserController);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
