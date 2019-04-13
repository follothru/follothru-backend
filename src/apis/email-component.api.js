module.exports = (() => {
  const express = require('express');
  const router = express.Router();
  const { EmailComponentService } = require('../services');
  const { EmailComponentPopulator } = require('../populators');
  router.get('/', (req, res) => {
    EmailComponentService.getAllComponents()
      .then(components => {
        components = components.map(component =>
          EmailComponentPopulator.populate(component)
        );
        res.send(components);
      })
      .catch(err => {
        console.error(err);
        res.send({ error: err.message });
      });
  });

  router.post('/', (req, res) => {
    const { templateId, values } = req.body;
    EmailComponentService.addComponent(templateId, values)
      .then(emailComponent => {
        res.send({ id: emailComponent._id });
      })
      .catch(err => {
        console.error(err);
        res.send({ error: err.message });
      });
  });

  return router;
})();
