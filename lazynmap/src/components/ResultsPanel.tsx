import React from 'react';
import { Box, Text } from 'ink';
import type { Host, Port, ViewMode } from '../types.js';
import { DANGEROUS_PORTS } from '../types.js';

interface ResultsPanelProps {
  hosts: Host[];
  rawLines: string[];
  viewMode: ViewMode;
  isScanning: boolean;
  scrollOffset: number;
  visibleLines: number;
}

type FlatItem =
  | { type: 'host'; host: Host }
  | { type: 'port'; host: Host; port: Port; isLast: boolean }
  | { type: 'spacer'; key: string }
  | { type: 'summary'; totalOpen: number; hostCount: number };

export function flattenHosts(hosts: Host[]): FlatItem[] {
  const items: FlatItem[] = [];
  const totalOpen = hosts.reduce(
    (sum, h) => sum + h.ports.filter(p => p.state === 'open').length,
    0,
  );
  for (const host of hosts) {
    items.push({ type: 'host', host });
    for (let i = 0; i < host.ports.length; i++) {
      items.push({ type: 'port', host, port: host.ports[i]!, isLast: i === host.ports.length - 1 });
    }
    items.push({ type: 'spacer', key: `spacer-${host.ip}` });
  }
  if (hosts.length > 0) {
    items.push({ type: 'summary', totalOpen, hostCount: hosts.length });
  }
  return items;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  hosts, rawLines, viewMode, isScanning, scrollOffset, visibleLines,
}) => {
  const totalLines = viewMode === 'raw' ? rawLines.length : flattenHosts(hosts).length;
  const showScroll = totalLines > visibleLines;
  const visibleEnd = Math.min(scrollOffset + visibleLines, totalLines);

  return (
    <Box flexDirection="column" flexGrow={1} paddingLeft={2}>
      <Box marginBottom={1}>
        <Text bold color="cyan">Results</Text>
        <Text color="gray">   </Text>
        {isScanning && <Text color="yellow">● </Text>}
        <Text color={viewMode === 'parsed' ? 'cyan' : 'gray'} underline={viewMode === 'parsed'}>
          parsed
        </Text>
        <Text color="gray"> │ </Text>
        <Text color={viewMode === 'raw' ? 'cyan' : 'gray'} underline={viewMode === 'raw'}>
          raw
        </Text>
        <Text color="gray" dimColor>   [v] toggle</Text>
        {showScroll && (
          <>
            <Text color="gray" dimColor>   </Text>
            <Text color="gray" dimColor>{scrollOffset + 1}–{visibleEnd}/{totalLines}</Text>
            <Text color="gray" dimColor> [↑↓]</Text>
          </>
        )}
      </Box>

      <Text color="gray" dimColor>{'─'.repeat(52)}</Text>

      {viewMode === 'parsed'
        ? <ParsedView hosts={hosts} scrollOffset={scrollOffset} visibleLines={visibleLines} />
        : <RawView lines={rawLines} scrollOffset={scrollOffset} visibleLines={visibleLines} />
      }
    </Box>
  );
};

const ParsedView: React.FC<{ hosts: Host[]; scrollOffset: number; visibleLines: number }> = ({
  hosts, scrollOffset, visibleLines,
}) => {
  if (hosts.length === 0) {
    return <Text color="gray" dimColor>No hosts found yet...</Text>;
  }

  const items = flattenHosts(hosts);
  const visible = items.slice(scrollOffset, scrollOffset + visibleLines);

  return (
    <Box flexDirection="column">
      {visible.map((item, idx) => {
        if (item.type === 'host') {
          const { host } = item;
          const openPorts = host.ports.filter(p => p.state === 'open');
          const hasDangerous = openPorts.some(p => DANGEROUS_PORTS.has(p.number));
          return (
            <Box key={`host-${host.ip}`}>
              <Text bold color="green">{host.ip}</Text>
              {host.hostname && <Text color="gray">  {host.hostname}</Text>}
              <Text> </Text>
              <Text color={hasDangerous ? 'red' : 'yellow'}>
                {openPorts.length} port{openPorts.length !== 1 ? 's' : ''} open
                {hasDangerous ? ' ⚠' : ''}
              </Text>
            </Box>
          );
        }
        if (item.type === 'port') {
          const { host, port, isLast } = item;
          const isDangerous = DANGEROUS_PORTS.has(port.number);
          return (
            <Box key={`${host.ip}-${port.number}/${port.protocol}`}>
              <Text color="gray">{isLast ? '  └  ' : '  ├  '}</Text>
              <Text color={isDangerous ? 'red' : 'yellow'}>
                {String(port.number).padStart(5)}/{port.protocol}
              </Text>
              <Text color="gray">  {port.service.padEnd(12)}</Text>
              {port.version && <Text dimColor>{port.version}</Text>}
              {isDangerous && <Text color="red">  ⚠</Text>}
            </Box>
          );
        }
        if (item.type === 'spacer') {
          return <Text key={item.key}> </Text>;
        }
        if (item.type === 'summary') {
          return (
            <Box key="summary" flexDirection="column">
              <Text color="gray" dimColor>{'─'.repeat(52)}</Text>
              <Text color="gray">
                {item.totalOpen} open port{item.totalOpen !== 1 ? 's' : ''} across{' '}
                {item.hostCount} host{item.hostCount !== 1 ? 's' : ''}
              </Text>
            </Box>
          );
        }
        return null;
      })}
    </Box>
  );
};

const RawView: React.FC<{ lines: string[]; scrollOffset: number; visibleLines: number }> = ({
  lines, scrollOffset, visibleLines,
}) => {
  if (lines.length === 0) {
    return <Text color="gray" dimColor>Waiting for output...</Text>;
  }
  const visible = lines.slice(scrollOffset, scrollOffset + visibleLines);
  return (
    <Box flexDirection="column">
      {visible.map((line, i) => (
        <Text key={scrollOffset + i} color="gray">{line}</Text>
      ))}
    </Box>
  );
};
