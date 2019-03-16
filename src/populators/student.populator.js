module.exports = (() => {
  function populate(student) {
    if (!student) {
      return null;
    }
    return {
      id: student._id,
      prefName: student.prefName,
      email: student.email,
      verified: student.verified
    };
  }

  return { populate };
})();
