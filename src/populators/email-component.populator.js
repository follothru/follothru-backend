module.exports = (() => {
  const { EmailComponentEnum } = require('../models');
  function populate(component) {
    const { _id, templateId, values, index } = component;
    const content = generateComponentHTML(component);

    return {
      id: _id,
      templateId,
      index,
      values,
      content
    };
  }

  function generateComponentHTML(component) {
    const fs = require('fs');
    const hbs = require('handlebars');
    try {
      const { templateId, values } = component;
      const inFile =
        __dirname + `/../../resources/email/templates/${templateId}.hbs`;
      const source = fs.readFileSync(inFile, 'utf8');
      const template = hbs.compile(source, { strict: true });
      return template(values);
    } catch (err) {
      console.error(err);
      return '';
    }
  }

  return { populate };
})();
