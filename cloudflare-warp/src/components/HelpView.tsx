import { Box, Text } from "ink";
import React from "react";

export const HelpView: React.FC = () => {
  const shortcuts = [
    { key: "space", description: "Toggle connection (Connect/Disconnect)" },
    { key: "r", description: "Refresh status and data" },
    { key: "m", description: "Go to Main screen" },
    { key: "s", description: "Go to Settings screen" },
    { key: "i", description: "Go to Stats screen" },
    { key: "h", description: "Show this Help screen" },
    { key: "1-4", description: "Change connection mode (in Settings)" },
    { key: "q", description: "Quit application" },
  ];

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Keyboard Shortcuts
        </Text>
      </Box>

      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="gray"
        paddingX={2}
        paddingY={1}
      >
        {shortcuts.map((shortcut) => (
          <Box key={shortcut.key} marginBottom={1}>
            <Box width={12}>
              <Text color="yellow" bold>
                {shortcut.key}
              </Text>
            </Box>
            <Text dimColor>{shortcut.description}</Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={1} paddingX={2}>
        <Text dimColor>Press any key to return to previous screen</Text>
      </Box>
    </Box>
  );
};
