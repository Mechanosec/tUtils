export type ScanType = 'quick' | 'full' | 'service' | 'os' | 'vuln' | 'custom';
export type ViewMode = 'parsed' | 'raw';

export interface Port {
  number: number;
  protocol: 'tcp' | 'udp';
  state: 'open' | 'filtered' | 'closed' | 'open|filtered';
  service: string;
  version?: string;
}

export interface Host {
  ip: string;
  hostname?: string;
  latency?: string;
  ports: Port[];
}

export interface ScanSummary {
  hostsUp: number;
  hostsTotal: number;
  elapsed: string;
}

export const SCAN_TYPES: ScanType[] = ['quick', 'full', 'service', 'os', 'vuln', 'custom'];

export const SCAN_TYPE_LABELS: Record<ScanType, string> = {
  quick:   'Quick Scan',
  full:    'Full TCP Scan',
  service: 'Service Detection',
  os:      'OS Detection',
  vuln:    'Vuln Scan',
  custom:  'Custom',
};

export const SCAN_TYPE_FLAGS: Record<Exclude<ScanType, 'custom'>, string[]> = {
  quick:   ['-T4', '-F'],
  full:    ['-p-', '-T4'],
  service: ['-sV', '-T4'],
  os:      ['-O', '-T4'],
  vuln:    ['--script', 'vuln', '-T4'],
};

export const SCAN_TYPE_FLAGS_DISPLAY: Record<ScanType, string> = {
  quick:   '-T4 -F',
  full:    '-p- -T4',
  service: '-sV -T4',
  os:      '-O -T4',
  vuln:    '--script vuln -T4',
  custom:  'manual',
};

export const DANGEROUS_PORTS = new Set([21, 23, 25, 110, 143, 512, 513, 514, 1433, 3306, 5900]);
