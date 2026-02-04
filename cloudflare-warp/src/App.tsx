import { Box, Text, useApp, useInput } from "ink";
import React, { useEffect, useState } from "react";
import { Header } from "./components/Header.js";
import { HelpView } from "./components/HelpView.js";
import { Menu } from "./components/Menu.js";
import { SettingsView } from "./components/SettingsView.js";
import { StatsView } from "./components/StatsView.js";
import { StatusView } from "./components/StatusView.js";
import type {
  Screen,
  WarpAccount,
  WarpSettings,
  WarpStats,
  WarpStatus,
} from "./types.js";
import { WarpClient } from "./warp.js";

export const App: React.FC = () => {
  const { exit } = useApp();
  const [currentScreen, setCurrentScreen] = useState<Screen>("main");
  const [status, setStatus] = useState<WarpStatus>({ status: "Disconnected" });
  const [settings, setSettings] = useState<WarpSettings>({
    mode: "warp",
    alwaysOn: false,
    switchLocked: false,
  });
  const [account, setAccount] = useState<WarpAccount | null>(null);
  const [stats, setStats] = useState<WarpStats>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const warpClient = new WarpClient();

  const showMessage = (msg: string, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), duration);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [newStatus, newSettings, newAccount, newStats] = await Promise.all([
        warpClient.getStatus(),
        warpClient.getSettings(),
        warpClient.getAccount(),
        warpClient.getStats(),
      ]);
      setStatus(newStatus);
      setSettings(newSettings);
      setAccount(newAccount);
      setStats(newStats);
    } catch (error) {
      showMessage("Error refreshing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useInput(async (input, key) => {
    if (input === "q") {
      exit();
      return;
    }

    if (input === "m") {
      setCurrentScreen("main");
      return;
    }

    if (input === "s") {
      setCurrentScreen("settings");
      return;
    }

    if (input === "i") {
      setCurrentScreen("stats");
      await refreshData();
      return;
    }

    if (input === "h") {
      setCurrentScreen("help");
      return;
    }

    if (input === "r") {
      showMessage("Refreshing...");
      await refreshData();
      showMessage("Refreshed!");
      return;
    }

    if (key.return || input === " ") {
      if (currentScreen === "main") {
        setLoading(true);
        try {
          await warpClient.toggleConnection();
          showMessage("Connection toggled");
          await refreshData();
        } catch (error) {
          showMessage("Error toggling connection");
        } finally {
          setLoading(false);
        }
      }
      return;
    }

    // Mode switching in settings screen
    if (currentScreen === "settings") {
      const modes: { [key: string]: "warp" | "doh" | "warp+doh" | "proxy" } = {
        "1": "warp",
        "2": "doh",
        "3": "warp+doh",
        "4": "proxy",
      };

      if (modes[input]) {
        setLoading(true);
        try {
          await warpClient.setMode(modes[input]);
          showMessage(`Mode changed to ${modes[input]}`);
          await refreshData();
        } catch (error) {
          showMessage("Error changing mode");
        } finally {
          setLoading(false);
        }
      }
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Header />

      {currentScreen === "main" && (
        <>
          <StatusView status={status} account={account} />
          <Box paddingX={2} marginTop={1}>
            <Text color="yellow">
              Press [space] to{" "}
              {status.status === "Connected" ? "disconnect" : "connect"} | [r]
              to refresh
            </Text>
          </Box>
        </>
      )}

      {currentScreen === "settings" && <SettingsView settings={settings} />}

      {currentScreen === "stats" && <StatsView stats={stats} />}

      {currentScreen === "help" && <HelpView />}

      <Menu currentScreen={currentScreen} />

      {message && (
        <Box paddingX={2} marginTop={1}>
          <Text color="green">ℹ {message}</Text>
        </Box>
      )}

      {loading && (
        <Box paddingX={2}>
          <Text dimColor>Loading...</Text>
        </Box>
      )}
    </Box>
  );
};
