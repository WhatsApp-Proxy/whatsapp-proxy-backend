import proxyServer, { proxyServerSchemaType } from '../models/proxyServer';

export async function findExistingProxy(discoveryKey: any, serverObject: proxyServerSchemaType): Promise<null | any> {
  return await proxyServer.findOne({ createdBy: discoveryKey, serverName: serverObject.serverName });
}
