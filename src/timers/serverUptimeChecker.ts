import { ping } from '../util/proxyPinger';
import proxyServer, { proxyServerSchemaType } from '../models/proxyServer';
import log from 'fancy-log';

export async function pingAllServers() {
  const allServers = await proxyServer.find({});
  if (!allServers) return;
  allServers.forEach(async (server: proxyServerSchemaType) => {
    const pingData = await ping(server.ipAddress, server.proxyPort);
    // if (pingData === null && server.pendingDeletion) {
    //   log(`Server ${server.serverName} is down! Removing it!`);
    //   await proxyServer.remove({ _id: server._id });
    // }
    if (pingData === null && !server.pendingDeletion) {
      log(`Server ${server.serverName} is down! Marking it for deletion!`);
      await proxyServer.updateOne({ _id: server._id }, { pendingDeletion: true });
    } else if (pingData !== null && server.pendingDeletion) {
      log(`Server ${server.serverName} is back up! Removing deletion mark!`);
      await proxyServer.updateOne({ _id: server._id }, { pendingDeletion: false });
    }
  });
}
