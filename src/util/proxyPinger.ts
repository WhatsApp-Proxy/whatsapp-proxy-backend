import { TCPConfig } from '../const/config';
import { tcpPingResultType, tcpPingType } from '../types/tcpPingType';
const nodejsTcpPing = require('nodejs-tcp-ping');
import log from 'fancy-log';

export async function ping(ip: string, port: number): Promise<number | null> {
  try {
    log(`Pinging: ${ip}:${port}...`);
    const result: tcpPingResultType[] = await nodejsTcpPing.tcpPing({
      attempts: TCPConfig.attempts,
      host: ip,
      port,
      timeout: TCPConfig.timeout,
    } as tcpPingType);

    let pingData: number | null = null;

    log('Ping results for', ip, port, result);

    result.forEach((pingResult: tcpPingResultType) => {
      if (pingResult.ping != null) {
        return (pingData = Math.floor(pingResult.ping));
      }
    });
    return pingData;
  } catch (e: any) {
    return null;
  }
}
