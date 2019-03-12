module.exports = (() => {
  function populate(subreminder, forObj) {
    if (!subreminder) {
      return null;
    }

    return {
      id: subreminder._id,
      name: subreminder.name,
      dateTime: subreminder.dateTime,
      for: forObj
    };
  }

  return { populate };
})();
