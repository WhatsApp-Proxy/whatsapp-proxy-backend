import { ObjectId } from 'mongoose';
import discoveryKey from '../models/discoveryKey';
import proxyServer, { proxyServerSchemaType } from '../models/proxyServer';

export async function calculateUsage(key: any): Promise<number> {
  const servers = await proxyServer.find({ createdBy: key, pendingDeletion: false });
  return servers?.length ?? 0;
}
