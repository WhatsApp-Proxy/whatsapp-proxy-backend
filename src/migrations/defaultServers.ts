import { proxyServerSchemaType } from '../models/proxyServer';

export const defaultServers: proxyServerSchemaType[] = [
  {
    ipAddress: '141.148.228.97',
    proxyPort: 82,
    discoveryPort: 8080,
    serverName: 'WhatsApp Proxy #1',
    country: 'NL',
    pendingDeletion: false,
    createdBy: null,
  },
];
