import React from 'react';
import { Box, Text } from 'ink';
import type { Host, ViewMode } from '../types.js';
import { DANGEROUS_PORTS } from '../types.js';

interface ResultsPanelProps {
  hosts: Host[];
  rawLines: string[];
  viewMode: ViewMode;
  isScanning: boolean;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  hosts, rawLines, viewMode, isScanning,
}) => {
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
      </Box>

      <Text color="gray" dimColor>{'─'.repeat(52)}</Text>

      {viewMode === 'parsed'
        ? <ParsedView hosts={hosts} />
        : <RawView lines={rawLines} />
      }
    </Box>
  );
};

const ParsedView: React.FC<{ hosts: Host[] }> = ({ hosts }) => {
  const totalOpen = hosts.reduce(
    (sum, h) => sum + h.ports.filter(p => p.state === 'open').length,
    0,
  );
  if (hosts.length === 0) {
    return <Text color="gray" dimColor>No hosts found yet...</Text>;
  }
  return (
    <Box flexDirection="column">
      {hosts.map(host => {
        const openPorts = host.ports.filter(p => p.state === 'open');
        const hasDangerous = openPorts.some(p => DANGEROUS_PORTS.has(p.number));
        return (
          <Box key={host.ip} flexDirection="column" marginBottom={1}>
            <Box>
              <Text bold color="green">{host.ip}</Text>
              {host.hostname && <Text color="gray">  {host.hostname}</Text>}
              <Text> </Text>
              <Text color={hasDangerous ? 'red' : 'yellow'}>
                {openPorts.length} port{openPorts.length !== 1 ? 's' : ''} open
                {hasDangerous ? ' ⚠' : ''}
              </Text>
            </Box>
            {host.ports.map((port, idx) => {
              const isLast = idx === host.ports.length - 1;
              const isDangerous = DANGEROUS_PORTS.has(port.number);
              return (
                <Box key={`${port.number}/${port.protocol}`}>
                  <Text color="gray">{isLast ? '  └  ' : '  ├  '}</Text>
                  <Text color={isDangerous ? 'red' : 'yellow'}>
                    {String(port.number).padStart(5)}/{port.protocol}
                  </Text>
                  <Text color="gray">  {port.service.padEnd(12)}</Text>
                  {port.version && <Text dimColor>{port.version}</Text>}
                  {isDangerous && <Text color="red">  ⚠</Text>}
                </Box>
              );
            })}
          </Box>
        );
      })}
      <Text color="gray" dimColor>{'─'.repeat(52)}</Text>
      <Text color="gray">
        {totalOpen} open port{totalOpen !== 1 ? 's' : ''} across{' '}
        {hosts.length} host{hosts.length !== 1 ? 's' : ''}
      </Text>
    </Box>
  );
};

const RawView: React.FC<{ lines: string[] }> = ({ lines }) => {
  if (lines.length === 0) {
    return <Text color="gray" dimColor>Waiting for output...</Text>;
  }
  return (
    <Box flexDirection="column">
      {lines.slice(-30).map((line, i) => (
        <Text key={lines.length - Math.min(30, lines.length) + i} color="gray">{line}</Text>
      ))}
    </Box>
  );
};
