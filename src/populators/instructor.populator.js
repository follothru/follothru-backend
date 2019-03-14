module.exports = (() => {
  function populate(instructor) {
    if (!instructor) {
      return null;
    }
    const { firstname, lastname, email } = instructor;
    return { id: instructor._id, firstname, lastname, email };
  }

  return { populate };
})();
