import React from 'react';
import { Box, Text } from 'ink';

interface HeaderProps {
  isScanning: boolean;
  elapsed: number;
}

export const Header: React.FC<HeaderProps> = ({ isScanning, elapsed }) => {
  const mm = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const ss = (elapsed % 60).toString().padStart(2, '0');

  return (
    <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={1}>
      <Text bold color="cyan">⚡ LazyNmap</Text>
      <Text color="gray"> │ </Text>
      {isScanning
        ? <Text color="yellow">● scanning  {mm}:{ss}</Text>
        : <Text color="gray">nmap terminal UI</Text>
      }
    </Box>
  );
};
