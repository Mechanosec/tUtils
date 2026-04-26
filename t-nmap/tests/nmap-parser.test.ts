import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseNmapLine } from '../src/nmap.js';
import type { Host } from '../src/types.js';

const makeHost = (): Host => ({ ip: '1.2.3.4', ports: [] });

test('host line — IP only', () => {
  const result = parseNmapLine('Nmap scan report for 192.168.1.1', null);
  assert.deepEqual(result, {
    type: 'host',
    host: { ip: '192.168.1.1', hostname: undefined, latency: undefined, ports: [] },
  });
});

test('host line — hostname and IP', () => {
  const result = parseNmapLine('Nmap scan report for router.local (192.168.1.1)', null);
  assert.deepEqual(result, {
    type: 'host',
    host: { ip: '192.168.1.1', hostname: 'router.local', latency: undefined, ports: [] },
  });
});

test('open port with version', () => {
  const result = parseNmapLine('22/tcp  open  ssh  OpenSSH 8.9p1', makeHost());
  assert.deepEqual(result, {
    type: 'port',
    port: { number: 22, protocol: 'tcp', state: 'open', service: 'ssh', version: 'OpenSSH 8.9p1' },
  });
});

test('open port without version', () => {
  const result = parseNmapLine('80/tcp  open  http', makeHost());
  assert.deepEqual(result, {
    type: 'port',
    port: { number: 80, protocol: 'tcp', state: 'open', service: 'http', version: undefined },
  });
});

test('filtered port', () => {
  const result = parseNmapLine('443/tcp  filtered  https', makeHost());
  assert.deepEqual(result, {
    type: 'port',
    port: { number: 443, protocol: 'tcp', state: 'filtered', service: 'https', version: undefined },
  });
});

test('latency line', () => {
  const result = parseNmapLine('Host is up (0.0023s latency).', makeHost());
  assert.deepEqual(result, { type: 'latency', latency: '0.0023s' });
});

test('done line', () => {
  const result = parseNmapLine(
    'Nmap done: 254 IP addresses (3 hosts up) scanned in 12.34 seconds',
    null,
  );
  assert.deepEqual(result, {
    type: 'done',
    hostsUp: 3,
    hostsTotal: 254,
    elapsed: '12.34 seconds',
  });
});

test('unrecognized line', () => {
  const result = parseNmapLine('Some random output', null);
  assert.deepEqual(result, { type: 'unknown' });
});

test('port line ignored without current host', () => {
  const result = parseNmapLine('22/tcp  open  ssh', null);
  assert.deepEqual(result, { type: 'unknown' });
});
