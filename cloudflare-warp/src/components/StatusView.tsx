import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import React from "react";
import type { WarpAccount, WarpStatus } from "../types.js";

interface StatusViewProps {
  status: WarpStatus;
  account: WarpAccount | null;
}

export const StatusView: React.FC<StatusViewProps> = ({ status, account }) => {
  const getStatusColor = () => {
    switch (status.status) {
      case "Connected":
        return "green";
      case "Connecting":
        return "yellow";
      default:
        return "red";
    }
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case "Connected":
        return "✓";
      case "Connecting":
        return "○";
      default:
        return "✗";
    }
  };

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Connection Status
        </Text>
      </Box>

      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="gray"
        paddingX={2}
        paddingY={1}
      >
        <Box marginBottom={1}>
          <Box width={15}>
            <Text dimColor>Status:</Text>
          </Box>
          <Box>
            {status.status === "Connecting" && (
              <Text color={getStatusColor()}>
                <Spinner type="dots" /> {status.status}
              </Text>
            )}
            {status.status !== "Connecting" && (
              <Text color={getStatusColor()} bold>
                {getStatusIcon()} {status.status}
              </Text>
            )}
          </Box>
        </Box>

        {status.mode && (
          <Box marginBottom={1}>
            <Box width={15}>
              <Text dimColor>Mode:</Text>
            </Box>
            <Text color="blue">{status.mode}</Text>
          </Box>
        )}

        {account && (
          <>
            <Box marginBottom={1}>
              <Box width={15}>
                <Text dimColor>Account:</Text>
              </Box>
              <Text color={account.premium ? "yellow" : "white"}>
                {account.accountType}
                {account.premium && " ⭐"}
              </Text>
            </Box>
            {account.license && (
              <Box>
                <Box width={15}>
                  <Text dimColor>License:</Text>
                </Box>
                <Text dimColor>{account.license}</Text>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};
