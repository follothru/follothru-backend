module.exports = (() => {
  function populate(component) {
    const { _id, content, category } = component;
    return {
      id: _id,
      category,
      content
    };
  }
  return { populate };
})();
