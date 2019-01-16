const express = require('express');
const app = express();
const port = 3000;

const CourseModel = require('./models/course.model.js');

app.get('/', (req, res) => {
    res.send('Hello World!');
    const courseBuilder = CourseModel.CourseModel.getBuilder().buildId(22);
    const course = courseBuilder.build();
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
