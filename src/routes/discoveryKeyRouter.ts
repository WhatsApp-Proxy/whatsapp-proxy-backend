import express, { Response, Request } from 'express';
import discoveryKey from '../models/discoveryKey';

const router = express.Router();

router.post('/register', async function (req: Request, res: Response) {
  try {
    if (!req.body.masterKey || req.body.masterKey !== process.env.DISCOVERY_MASTER_KEY) {
      res.status(403).json({ error: 'You must provide a master key to register a server!', data: null });
      return;
    }

    const newDiscoveryKey = new discoveryKey(req.body);
    const savedKey = await newDiscoveryKey.save();
    return res.json({ data: savedKey, error: null });
  } catch (err) {
    return res.status(500).json({ error: err, data: null });
  }
});

export default router;
