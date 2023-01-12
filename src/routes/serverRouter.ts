import express, { Response, Request } from 'express';
import proxyServer, { proxyServerSchemaType } from '../models/proxyServer';
import { ping } from '../util/proxyPinger';
import discoveryKey from '../models/discoveryKey';
import { calculateUsage } from '../util/calculateUsage';
import { ServerPrefix } from '../const/config';
import log from 'fancy-log';
import { findExistingProxy } from '../util/findExistingProxy';

const router = express.Router();

router.get('/', async function (req: Request, res: Response) {
  proxyServer.find({ pendingDeletion: false }, { __v: 0 }, function (err: any, servers: proxyServerSchemaType[]) {
    if (err) {
      res.status(500).json({ error: err, data: null });
    } else {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      res.json({ data: servers, error: null });
    }
  });
});

router.get('/:id', async function (req: Request, res: Response) {
  proxyServer.findOne({ _id: req.params.id, pendingDeletion: false }, { __v: 0 }, function (err: any, server: proxyServerSchemaType) {
    if (err) {
      res.status(500).json({ error: err, data: null });
    } else {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      res.json({ data: server, error: null });
    }
  });
});

router.post('/register', async function (req: Request, res: Response) {
  try {
    if (!req.body.key) {
      res.status(403).json({ error: 'You must provide a key to register a server!', data: null });
      return;
    }

    const foundKey = await discoveryKey.findOne({ key: req.body.key });
    if (!foundKey || !foundKey.isActive) {
      res.status(403).json({ error: 'Invalid key or key is no longer active!', data: null });
      return;
    }

    const usage = await calculateUsage(foundKey._id);
    if (foundKey.maxUsages !== 0 && usage >= foundKey.maxUsages) {
      res.status(403).json({ error: 'You have reached your maximum server limit!', data: null });
      return;
    }

    if (req.body.serverName.includes(ServerPrefix)) {
      res.status(403).json({ error: `Server name cannot contain, ${ServerPrefix}!`, data: null });
      return;
    }

    const pingData = await ping(req.body.ipAddress, req.body.proxyPort);
    if (pingData === null) {
      res.status(500).json({ error: 'Server is down!', data: null });
      return;
    }
    const existingServer = await findExistingProxy(foundKey._id, req.body);
    if (existingServer !== null) {
      // update server with new ip
      log(`Updating server ${existingServer.serverName} with new ip ${req.body.ipAddress}...`);
      existingServer.ipAddress = req.body.ipAddress;
      await existingServer.save();
      return res.json({ data: existingServer, error: null });
    }

    const server = new proxyServer({
      ipAddress: req.body.ipAddress,
      proxyPort: req.body.proxyPort,
      discoveryPort: req.body.discoveryPort,
      serverName: foundKey?.serverNamePrefix + req.body.serverName,
      country: req.body.country,
      pendingDeletion: false,
      createdBy: foundKey._id,
    });

    server.save(function (err: any, newServer: proxyServerSchemaType) {
      if (err) {
        res.status(500).json({ error: err, data: null });
      } else {
        res.json({ data: newServer, error: null });
      }
    });
  } catch (err) {
    log(err);
    res.status(500).json({ error: 'Something went wrong while trying to register your server! Please try again later.', data: null });
    return;
  }
});

export default router;
