export interface WarpStatus {
  status: "Connected" | "Disconnected" | "Connecting";
  mode?: string;
}

export interface WarpSettings {
  mode: string;
  alwaysOn: boolean;
  switchLocked: boolean;
  license?: string;
}

export interface WarpAccount {
  accountType: string;
  license?: string;
  created?: string;
  updated?: string;
  premium?: boolean;
}

export interface WarpStats {
  bytesReceived?: string;
  bytesSent?: string;
}

export type Screen = "main" | "settings" | "stats" | "help";
