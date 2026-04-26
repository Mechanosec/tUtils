import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, useApp, useInput } from 'ink';
import { writeFileSync } from 'node:fs';
import { Header } from './components/Header.js';
import { ConfigPanel } from './components/ConfigPanel.js';
import { ResultsPanel } from './components/ResultsPanel.js';
import { StatusBar } from './components/StatusBar.js';
import { NmapClient, isNmapAvailable } from './nmap.js';
import type { Host, ScanType, ViewMode } from './types.js';
import { SCAN_TYPES } from './types.js';

export const App: React.FC = () => {
  const { exit } = useApp();
  const client = useRef(new NmapClient());

  const [target, setTarget]               = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [customFlags, setCustomFlags]     = useState('');
  const [targetFocused, setTargetFocused]           = useState(false);
  const [customFlagsFocused, setCustomFlagsFocused] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [viewMode, setViewMode]     = useState<ViewMode>('parsed');
  const [hosts, setHosts]           = useState<Host[]>([]);
  const [rawLines, setRawLines]     = useState<string[]>([]);
  const [elapsed, setElapsed]       = useState(0);
  const [message, setMessage]       = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scanType: ScanType = SCAN_TYPES[selectedIndex]!;

  const showMessage = (msg: string, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const runScan = useCallback(() => {
    if (!target.trim())     { showMessage('Enter a target first'); return; }
    if (!isNmapAvailable()) { showMessage('nmap not found in PATH — install nmap first'); return; }
    if (scanType === 'os' && process.getuid?.() !== 0) {
      showMessage('OS detection requires sudo');
      return;
    }

    setHosts([]);
    setRawLines([]);
    setIsScanning(true);
    setElapsed(0);
    if (scanType === 'vuln') setViewMode('raw');

    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    client.current.start(target.trim(), scanType, customFlags);
  }, [target, scanType, customFlags]);

  const stopScan = useCallback(() => {
    client.current.kill();
    setIsScanning(false);
    stopTimer();
    showMessage('Scan stopped');
  }, []);

  const exportResults = useCallback(() => {
    if (rawLines.length === 0) { showMessage('Nothing to export'); return; }
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `lazyscan-${ts}.txt`;
    writeFileSync(filename, rawLines.join('\n'));
    showMessage(`Saved to ${filename}`);
  }, [rawLines]);

  useEffect(() => {
    const c = client.current;

    c.on('line', (line: string) => setRawLines(prev => [...prev, line]));

    c.on('host', (host: Host) => {
      setHosts(prev => {
        const idx = prev.findIndex(h => h.ip === host.ip);
        if (idx >= 0) { const next = [...prev]; next[idx] = host; return next; }
        return [...prev, host];
      });
    });

    c.on('done', () => {
      setIsScanning(false);
      stopTimer();
      showMessage('Scan complete');
    });

    return () => { c.kill(); stopTimer(); };
  }, []);

  useInput((input, key) => {
    if (targetFocused) {
      if (key.tab || key.escape) {
        setTargetFocused(false);
        if (key.tab && scanType === 'custom') setCustomFlagsFocused(true);
      }
      return;
    }

    if (customFlagsFocused) {
      if (key.tab || key.escape) setCustomFlagsFocused(false);
      return;
    }

    if (input === 'q')                               { client.current.kill(); exit(); return; }
    if (key.upArrow   && !isScanning) setSelectedIndex(i => (i - 1 + SCAN_TYPES.length) % SCAN_TYPES.length);
    if (key.downArrow && !isScanning) setSelectedIndex(i => (i + 1) % SCAN_TYPES.length);
    if (key.tab)                      { setTargetFocused(true); return; }
    if ((key.return || input === ' ') && !isScanning) runScan();
    if (input === 'x' && isScanning)  stopScan();
    if (input === 'v')                setViewMode(m => m === 'parsed' ? 'raw' : 'parsed');
    if (input === 'e')                exportResults();
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Header isScanning={isScanning} elapsed={elapsed} />
      <Box flexDirection="row">
        <ConfigPanel
          target={target}
          scanType={scanType}
          customFlags={customFlags}
          selectedIndex={selectedIndex}
          targetFocused={targetFocused}
          customFlagsFocused={customFlagsFocused}
          isScanning={isScanning}
          onTargetChange={setTarget}
          onCustomFlagsChange={setCustomFlags}
        />
        <Box
          borderStyle="single"
          borderLeft
          borderRight={false}
          borderTop={false}
          borderBottom={false}
          borderColor="gray"
          paddingLeft={1}
          flexGrow={1}
        >
          <ResultsPanel
            hosts={hosts}
            rawLines={rawLines}
            viewMode={viewMode}
            isScanning={isScanning}
          />
        </Box>
      </Box>
      <StatusBar
        isScanning={isScanning}
        hostsFound={hosts.length}
        elapsed={elapsed}
        message={message}
      />
    </Box>
  );
};
