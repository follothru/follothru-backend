module.exports = (() => {
  const InstructorPopulator = require('./instructor.populator.js');

  function populate(course) {
    if (!course) {
      return null;
    }
    const instructors = course.instructors.map(instructor =>
      InstructorPopulator.populate(instructor)
    );
    return {
      id: course._id,
      name: course.name,
      studentsCount: course.students.length,
      hasPlanningPrompt: course.hasPlanningPrompt,
      planningPrompt: course.planningPrompt,
      instructors
    };
  }

  return { populate };
})();
