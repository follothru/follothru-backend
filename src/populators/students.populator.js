module.exports = (() => {
  const StudentPopulator = require('./student.populator.js');

  function populate(students) {
    if (!students || students.length <= 0) {
      return [];
    }
    return students.map(student => StudentPopulator.populate(student));
  }

  return { populate };
})();
