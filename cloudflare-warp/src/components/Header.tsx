import { Box, Text } from "ink";
import React from "react";

export const Header: React.FC = () => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box borderStyle="round" borderColor="cyan" paddingX={2}>
        <Text bold color="cyan">
          ⚡ WARP TUI - Cloudflare WARP Manager
        </Text>
      </Box>
    </Box>
  );
};
