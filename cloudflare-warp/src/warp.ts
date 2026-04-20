import { exec } from "child_process";
import { promisify } from "util";
import type {
  WarpAccount,
  WarpSettings,
  WarpStats,
  WarpStatus,
} from "./types.js";

const execAsync = promisify(exec);

export class WarpClient {
  async getStatus(): Promise<WarpStatus> {
    try {
      const { stdout } = await execAsync("warp-cli status");
      const lines = stdout.trim().split("\n");

      let status: WarpStatus["status"] = "Disconnected";
      let mode: string | undefined;

      for (const line of lines) {
        if (line.includes("Status update:")) {
          if (line.includes("Connected")) status = "Connected";
          else if (line.includes("Connecting")) status = "Connecting";
          else status = "Disconnected";
        }
        if (line.includes("Mode:")) {
          mode = line.split("Mode:")[1]?.trim();
        }
      }

      return { status, mode };
    } catch (error) {
      return { status: "Disconnected" };
    }
  }

  async connect(): Promise<void> {
    await execAsync("warp-cli connect");
  }

  async disconnect(): Promise<void> {
    await execAsync("warp-cli disconnect");
  }

  async toggleConnection(): Promise<void> {
    const status = await this.getStatus();
    if (status.status === "Connected") {
      await this.disconnect();
    } else {
      await this.connect();
    }
  }

  async setMode(mode: "warp" | "doh" | "warp+doh" | "proxy"): Promise<void> {
    await execAsync(`warp-cli mode ${mode}`);
  }

  async getSettings(): Promise<WarpSettings> {
    try {
      const { stdout } = await execAsync("warp-cli settings list");
      const lines = stdout.trim().split("\n");

      const settings: WarpSettings = {
        mode: "warp",
        alwaysOn: false,
        switchLocked: false,
      };

      for (const line of lines) {
        if (line.includes("Mode:")) {
          settings.mode = line.split(":")[1]?.trim() || "warp";
        }
        if (line.includes("Always On:")) {
          settings.alwaysOn = line.includes("true") || line.includes("On");
        }
        if (line.includes("Switch Locked:")) {
          settings.switchLocked =
            line.includes("true") || line.includes("Locked");
        }
      }

      return settings;
    } catch (error) {
      return {
        mode: "warp",
        alwaysOn: false,
        switchLocked: false,
      };
    }
  }

  async getAccount(): Promise<WarpAccount | null> {
    try {
      const { stdout } = await execAsync("warp-cli registration show");
      const lines = stdout.trim().split("\n");

      const account: WarpAccount = {
        accountType: "Free",
      };

      for (const line of lines) {
        if (line.includes("Account type:")) {
          account.accountType = line.split(":")[1]?.trim() || "Free";
        }
        if (line.startsWith("License:")) {
          account.license = line.split(":")[1]?.trim();
        }
      }

      return account;
    } catch (error) {
      return null;
    }
  }

  async getStats(): Promise<WarpStats> {
    try {
      const { stdout } = await execAsync("warp-cli tunnel stats");
      const lines = stdout.trim().split("\n");

      const stats: WarpStats = {};

      for (const line of lines) {
        if (line.startsWith("Tunnel Protocol:")) {
          stats.protocol = line.split(":").slice(1).join(":").trim();
        }
        if (line.startsWith("Endpoints:")) {
          stats.endpoint = line.split(":").slice(1).join(":").trim();
        }
        if (line.startsWith("Sent:")) {
          const match = line.match(/Sent:\s*([^;]+);\s*Received:\s*(.+)/);
          if (match) {
            stats.sent = match[1].trim();
            stats.received = match[2].trim();
          }
        }
        if (line.startsWith("Estimated latency:")) {
          stats.latency = line.split(":")[1]?.trim();
        }
        if (line.startsWith("Estimated loss:")) {
          stats.loss = line.split(":")[1]?.trim();
        }
      }

      return stats;
    } catch (error) {
      return {};
    }
  }
}
