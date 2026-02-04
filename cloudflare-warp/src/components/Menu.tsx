import { Box, Text } from "ink";
import React from "react";
import type { Screen } from "../types.js";

interface MenuProps {
  currentScreen: Screen;
}

export const Menu: React.FC<MenuProps> = ({ currentScreen }) => {
  const menuItems = [
    { key: "m", label: "Main", screen: "main" as Screen },
    { key: "s", label: "Settings", screen: "settings" as Screen },
    { key: "i", label: "Stats", screen: "stats" as Screen },
    { key: "h", label: "Help", screen: "help" as Screen },
  ];

  return (
    <Box flexDirection="column" paddingX={2} marginTop={1}>
      <Box borderStyle="single" borderColor="gray" paddingX={2} paddingY={1}>
        <Box flexDirection="row" justifyContent="space-around" width="100%">
          {menuItems.map((item) => (
            <Box key={item.key} marginX={1}>
              <Text
                color={currentScreen === item.screen ? "cyan" : "gray"}
                bold={currentScreen === item.screen}
              >
                [{item.key}] {item.label}
              </Text>
            </Box>
          ))}
          <Box marginX={1}>
            <Text color="red">[q] Quit</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
