import * as extraService from '../services/extra.service.js';

async function getExtraById(req, res) {
    try {
      const { extraId } = req.params;
      if (!extraId ) {
        return res.status(400).send('Missing extraId');
      }
      const extra = await extraService.getExtraById(extraId);
      res.json(extra);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  }

export { getExtraById };
