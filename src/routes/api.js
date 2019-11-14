import express from 'express';
import { getClusteringResult } from '../controllers/apiController';

const router = express.Router(); // eslint-disable-line new-cap
// API routes.

router.route('/clustering/:method')
  .get(async (req, res, next) => {
    try {
      const { method } = req.params;
      const { iterations, clusters, format, pretty } = req.query;
      const result = await getClusteringResult(
        method,
        format,
        parseInt(iterations),
        parseInt(clusters)
      );

      const spacing = Boolean(pretty) ? 2 : 0;

      return res.send(JSON.stringify(result, null, spacing));
    } catch (err) {
      return next(err);
    }
  });

export default router;
