import { execFileSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { spawn, type ChildProcess } from 'node:child_process';
import type { Host, Port } from './types.js';
import type { ScanType } from './types.js';
import { SCAN_TYPE_FLAGS } from './types.js';

export type ParseResult =
  | { type: 'host'; host: Host }
  | { type: 'port'; port: Port }
  | { type: 'latency'; latency: string }
  | { type: 'done'; hostsUp: number; hostsTotal: number; elapsed: string }
  | { type: 'unknown' };

export function parseNmapLine(line: string, currentHost: Host | null): ParseResult {
  const hostMatch = line.match(/^Nmap scan report for (.+?)(?:\s+\((.+?)\))?$/);
  if (hostMatch) {
    const ip = hostMatch[2] ?? hostMatch[1]!;
    const hostname = hostMatch[2] ? hostMatch[1] : undefined;
    return { type: 'host', host: { ip, hostname, latency: undefined, ports: [] } };
  }

  const portMatch = line.match(/^(\d+)\/(tcp|udp)\s+(open\|filtered|open|filtered|closed)\s+(\S+)(?:\s+(.+))?$/);
  if (portMatch && currentHost !== null) {
    const port: Port = {
      number: parseInt(portMatch[1]!, 10),
      protocol: portMatch[2] as 'tcp' | 'udp',
      state: portMatch[3] as 'open' | 'filtered' | 'closed' | 'open|filtered',
      service: portMatch[4]!,
      version: portMatch[5]?.trim() || undefined,
    };
    return { type: 'port', port };
  }

  const latencyMatch = line.match(/^Host is up \((.+?)s latency\)/);
  if (latencyMatch) {
    return { type: 'latency', latency: latencyMatch[1]! + 's' };
  }

  const doneMatch = line.match(
    /^Nmap done: (\d+) IP address(?:es)? \((\d+) hosts? up\) scanned in (.+)/,
  );
  if (doneMatch) {
    return {
      type: 'done',
      hostsTotal: parseInt(doneMatch[1]!, 10),
      hostsUp: parseInt(doneMatch[2]!, 10),
      elapsed: doneMatch[3]!,
    };
  }

  return { type: 'unknown' };
}

// execFileSync bypasses the shell — no injection risk even though input is hardcoded
export function isNmapAvailable(): boolean {
  try {
    execFileSync('nmap', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export class NmapClient extends EventEmitter {
  private proc: ChildProcess | null = null;
  private currentHost: Host | null = null;

  // spawn() passes args as array — no shell involved, no injection risk
  buildArgs(target: string, scanType: ScanType, customFlags: string): string[] {
    if (scanType === 'custom') {
      return [...customFlags.split(' ').filter(Boolean), target];
    }
    return [...SCAN_TYPE_FLAGS[scanType], target];
  }

  start(target: string, scanType: ScanType, customFlags: string): void {
    if (this.proc) this.kill();
    this.currentHost = null;

    const args = this.buildArgs(target, scanType, customFlags);
    this.proc = spawn('nmap', args);

    let lineBuffer = '';

    this.proc.stdout?.on('data', (chunk: Buffer) => {
      lineBuffer += chunk.toString();
      const lines = lineBuffer.split('\n');
      lineBuffer = lines.pop() ?? '';
      for (const line of lines) {
        this.handleLine(line.trimEnd());
      }
    });

    this.proc.stderr?.on('data', (chunk: Buffer) => {
      for (const line of chunk.toString().split('\n')) {
        if (line.trim()) this.emit('line', line.trimEnd());
      }
    });

    this.proc.on('close', () => {
      if (lineBuffer.trim()) this.handleLine(lineBuffer.trimEnd());
      if (this.currentHost) {
        this.emit('host', this.currentHost);
        this.currentHost = null;
      }
      this.proc = null;
      this.emit('done');
    });
  }

  private handleLine(line: string): void {
    if (!line) return;
    this.emit('line', line);

    const result = parseNmapLine(line, this.currentHost);

    switch (result.type) {
      case 'host':
        if (this.currentHost) this.emit('host', this.currentHost);
        this.currentHost = result.host;
        break;
      case 'port':
        if (this.currentHost) this.currentHost.ports.push(result.port);
        break;
      case 'latency':
        if (this.currentHost) this.currentHost.latency = result.latency;
        break;
      case 'done':
        if (this.currentHost) {
          this.emit('host', this.currentHost);
          this.currentHost = null;
        }
        break;
    }
  }

  kill(): void {
    if (this.proc) {
      this.proc.kill('SIGTERM');
      this.proc = null;
    }
  }

  isRunning(): boolean {
    return this.proc !== null;
  }
}
