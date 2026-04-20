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
        {stats.sent ? (
          <>
            {stats.protocol && (
              <Box marginBottom={1}>
                <Box width={18}><Text dimColor>Protocol:</Text></Box>
                <Text color="cyan">{stats.protocol}</Text>
              </Box>
            )}
            <Box marginBottom={1}>
              <Box width={18}><Text dimColor>Received:</Text></Box>
              <Text color="green">{stats.received}</Text>
            </Box>
            <Box marginBottom={1}>
              <Box width={18}><Text dimColor>Sent:</Text></Box>
              <Text color="blue">{stats.sent}</Text>
            </Box>
            {stats.latency && (
              <Box marginBottom={1}>
                <Box width={18}><Text dimColor>Latency:</Text></Box>
                <Text color="yellow">{stats.latency}</Text>
              </Box>
            )}
            {stats.loss && (
              <Box marginBottom={1}>
                <Box width={18}><Text dimColor>Loss:</Text></Box>
                <Text>{stats.loss}</Text>
              </Box>
            )}
            {stats.endpoint && (
              <Box>
                <Box width={18}><Text dimColor>Endpoint:</Text></Box>
                <Text dimColor>{stats.endpoint}</Text>
              </Box>
            )}
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
