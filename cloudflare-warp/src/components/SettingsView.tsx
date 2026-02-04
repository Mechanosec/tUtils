import { Box, Text } from "ink";
import React from "react";
import type { WarpSettings } from "../types.js";

interface SettingsViewProps {
  settings: WarpSettings;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings }) => {
  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Current Settings
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
          <Box width={18}>
            <Text dimColor>Connection Mode:</Text>
          </Box>
          <Text color="blue">{settings.mode}</Text>
        </Box>

        <Box marginBottom={1}>
          <Box width={18}>
            <Text dimColor>Always On:</Text>
          </Box>
          <Text color={settings.alwaysOn ? "green" : "red"}>
            {settings.alwaysOn ? "✓ Enabled" : "✗ Disabled"}
          </Text>
        </Box>

        <Box>
          <Box width={18}>
            <Text dimColor>Switch Locked:</Text>
          </Box>
          <Text color={settings.switchLocked ? "yellow" : "green"}>
            {settings.switchLocked ? "🔒 Locked" : "🔓 Unlocked"}
          </Text>
        </Box>
      </Box>

      <Box marginTop={1} paddingX={2}>
        <Text dimColor>Available modes: warp, doh, warp+doh, proxy</Text>
      </Box>

      <Box marginTop={1} paddingX={2}>
        <Text color="yellow">[1] warp [2] doh [3] warp+doh [4] proxy</Text>
      </Box>
    </Box>
  );
};
