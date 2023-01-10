import { proxyServerSchemaType } from '../models/proxyServer';

export const defaultServers: proxyServerSchemaType[] = [
  {
    ipAddress: '141.148.228.97',
    proxyPort: 82,
    discoveryPort: 7070,
    serverName: '[OFFICIAL] WhatsApp Proxy #1',
    country: 'NL',
    pendingDeletion: false,
    createdBy: null,
  },
  {
    ipAddress: '68.183.8.87',
    proxyPort: 80,
    discoveryPort: 7070,
    serverName: '[OFFICIAL] WhatsApp Proxy #2',
    country: 'NL',
    pendingDeletion: false,
    createdBy: null,
  },
  {
    ipAddress: '64.227.75.24',
    proxyPort: 82,
    discoveryPort: 7070,
    serverName: '[OFFICIAL] WhatsApp Proxy #3',
    country: 'NL',
    pendingDeletion: false,
    createdBy: null,
  },
  {
    ipAddress: '51.14.190.56',
    proxyPort: 5222,
    // discoveryPort: 8080,
    serverName: "Jaiden051's Proxy",
    country: 'GB',
    pendingDeletion: false,
    createdBy: null,
  },
];
