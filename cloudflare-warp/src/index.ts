#!/usr/bin/env node
import { render } from "ink";
import React from "react";
import { App } from "./App.js";

// Enable alternate screen buffer (like lazygit)
// This makes the app open in a separate screen and restore terminal on exit
process.stdout.write("\x1b[?1049h"); // Enter alternate screen
process.stdout.write("\x1b[H"); // Move cursor to home position

// Cleanup function to restore terminal
const cleanup = () => {
  process.stdout.write("\x1b[?1049l"); // Exit alternate screen
};

// Handle exit events
process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(0);
});
process.on("SIGTERM", () => {
  cleanup();
  process.exit(0);
});

// Render the app
const { unmount, waitUntilExit } = render(React.createElement(App));

// Wait for app to exit and cleanup
waitUntilExit().then(() => {
  cleanup();
  process.exit(0);
});
