import express from 'express';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get((req, res) => {
    return res.sendStatus(204);
  });

export default router;
