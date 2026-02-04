import { Box, Text } from "ink";
import React from "react";
import type { WarpStats } from "../types.js";

interface StatsViewProps {
  stats: WarpStats;
}

export const StatsView: React.FC<StatsViewProps> = ({ stats }) => {
  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Connection Statistics
        </Text>
      </Box>

      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="gray"
        paddingX={2}
        paddingY={1}
      >
        {stats.bytesReceived ? (
          <>
            <Box marginBottom={1}>
              <Box width={18}>
                <Text dimColor>Bytes Received:</Text>
              </Box>
              <Text color="green">{stats.bytesReceived}</Text>
            </Box>

            <Box>
              <Box width={18}>
                <Text dimColor>Bytes Sent:</Text>
              </Box>
              <Text color="blue">{stats.bytesSent || "N/A"}</Text>
            </Box>
          </>
        ) : (
          <Box>
            <Text color="yellow">
              No statistics available. Connect to WARP first.
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
