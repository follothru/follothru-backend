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
    const { content } = req.body;
    EmailComponentService.addComponent(content)
      .then(emailComponent => {
        res.send({ id: emailComponent._id });
      })
      .catch(err => {
        console.error(err);
        res.send({ error: err.message });
      });
  });

  router.put('/:id', (req, res) => {
    const id = req.params.id;
  });

  router.delete('/:id', (req, res) => {
    const id = req.params.id;
  });

  return router;
})();
