import { ping } from '../util/proxyPinger';
import proxyServer, { proxyServerSchemaType } from '../models/proxyServer';
import log from 'fancy-log';

export async function pingAllServers() {
  const allServers = await proxyServer.find({});
  if (!allServers) return;
  allServers.forEach(async (server: proxyServerSchemaType) => {
    const pingData = await ping(server.ipAddress, server.proxyPort);
    if (!pingData && server.pendingDeletion) {
      log(`Server ${server.serverName} is down! Removing it!`);
      await proxyServer.remove({ _id: server._id });
    } else if (!pingData && !server.pendingDeletion) {
      log(`Server ${server.serverName} is down! Marking it for deletion!`);
      await proxyServer.updateOne({ _id: server._id }, { pendingDeletion: true });
    }
  });
}
