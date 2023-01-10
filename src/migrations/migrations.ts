import dotenv from 'dotenv';
import mongoose from 'mongoose';
import log from 'fancy-log';
dotenv.config();
mongoose.connect(process.env.MONGO_DB_URL as string);

import discoveryKey from '../models/discoveryKey';
import proxyServer, { proxyServerSchemaType } from '../models/proxyServer';
import { ServerPrefix } from '../const/config';
import { defaultServers } from './defaultServers';

export async function runMigrations() {
  await createDiscoveryKey();
  const keyCode = process.env.DISCOVERY_MASTER_KEY;
  const key = await discoveryKey.findOne({ key: keyCode });
  if (!key) {
    log('No key found!');
    return;
  }
  await createProxyServers(key._id);
}

async function createDiscoveryKey() {
  try {
    const keyCode = process.env.DISCOVERY_MASTER_KEY;
    if (keyCode == null) {
      log('No discovery key found in .env file');
      return;
    }

    const key = new discoveryKey({ key: keyCode, maxUsages: 0, serverNamePrefix: ServerPrefix, isActive: true });
    await key.save();
    log(`Created a key!`);
  } catch (e) {
    log(`Could not add key: ${process.env.DISCOVERY_MASTER_KEY}, maybe it has already been seeded?`);
  }
}

async function createProxyServers(keyId: any) {
  log(`Migrating ${defaultServers.length} servers`);
  let index = 0;
  defaultServers.forEach(async server => {
    try {
      index++;
      server.createdBy = keyId;
      server.serverName = ServerPrefix + server.serverName;
      const newServer = new proxyServer(server);
      await newServer.save();
      log(`Added server ${server.serverName}, (${index}/${defaultServers.length})!`);
    } catch (e) {
      log(`Could not add server ${server.serverName}, (${index}/${defaultServers.length})!`);
    }
  });
}

runMigrations();
