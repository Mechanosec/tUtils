import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
  isScanning: boolean;
  hostsFound: number;
  elapsed: number;
  message: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  isScanning, hostsFound, elapsed, message,
}) => {
  const mm = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const ss = (elapsed % 60).toString().padStart(2, '0');

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text color="gray" dimColor>{'─'.repeat(70)}</Text>
      <Box paddingX={1}>
        {message ? (
          <Text color="green">ℹ {message}</Text>
        ) : isScanning ? (
          <Box>
            <Text color="yellow">● </Text>
            <Text color="gray">{mm}:{ss}  │  hosts: {hostsFound}  │  </Text>
            <Text color="red">[x]</Text>
            <Text color="gray"> stop</Text>
          </Box>
        ) : (
          <Text color="gray" dimColor>
            [j/k] type  [↑↓] scroll  [tab] target  [⏎] run  [v] toggle  [e] export  [q] quit
          </Text>
        )}
      </Box>
    </Box>
  );
};
