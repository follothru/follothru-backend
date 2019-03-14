module.exports = (() => {
  const CoursePopulator = require('./course.populator.js');

  function populate(courses) {
    if (!courses) {
      return [];
    }
    return courses.map(course => CoursePopulator.populate(course));
  }

  return {
    populate
  };
})();
