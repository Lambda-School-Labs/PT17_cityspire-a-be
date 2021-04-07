const express = require('express');
// const authRequired = require('../middleware/authRequired');
const Indeed = require('./indeedModel');
const router = express.Router();

router.get('/', function (req, res) {
  Indeed.findAll()
    .then((indeed) => {
      res.status(200).json(indeed);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get('/:id', function (req, res) {
  const id = String(req.params.id);
  Indeed.findById(id)
    .then((indeed) => {
      if (indeed) {
        res.status(200).json(indeed);
      } else {
        res.status(404).json({ error: 'JobsNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.put('/', function (req, res) {
  const indeed = req.body;
  if (indeed) {
    const id = indeed.id || 0;
    Indeed.findById(id)
      .then(
        Indeed.update(id, indeed)
          .then((updated) => {
            res.status(200).json({ message: 'Job Added', indeed: updated[0] });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not update job '${id}'`,
              error: err.message,
            });
          })
      )
      .catch((err) => {
        res.status(404).json({
          message: `Could not find job '${id}'`,
          error: err.message,
        });
      });
  }
});

router.delete('/:id', function (req, res) {
  const id = req.params.id;
  try {
    Indeed.findById(id).then((indeed) => {
      Indeed.remove(indeed.id).then(() => {
        res
          .status(200)
          .json({ message: `Job '${id}' was deleted.`, indeed: indeed });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete job with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;
