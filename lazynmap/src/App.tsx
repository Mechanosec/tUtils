import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, useApp, useInput } from 'ink';
import { writeFileSync } from 'node:fs';
import { Header } from './components/Header.js';
import { ConfigPanel } from './components/ConfigPanel.js';
import { ResultsPanel, flattenHosts } from './components/ResultsPanel.js';
import { StatusBar } from './components/StatusBar.js';
import { NmapClient, isNmapAvailable } from './nmap.js';
import type { Host, ScanType, ViewMode } from './types.js';
import { SCAN_TYPES } from './types.js';

const VISIBLE_LINES = Math.max(5, (process.stdout.rows || 24) - 10);

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
  const [scrollOffset, setScrollOffset] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoScrollRef = useRef(true);

  const scanType: ScanType = SCAN_TYPES[selectedIndex]!;

  const showMessage = useCallback((msg: string, duration = 3000) => {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    setMessage(msg);
    messageTimerRef.current = setTimeout(() => setMessage(''), duration);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

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
    setScrollOffset(0);
    autoScrollRef.current = true;
    if (scanType === 'vuln') setViewMode('raw');

    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    client.current.start(target.trim(), scanType, customFlags);
  }, [target, scanType, customFlags, showMessage]);

  const stopScan = useCallback(() => {
    client.current.kill();
    setIsScanning(false);
    stopTimer();
    showMessage('Scan stopped');
  }, [showMessage, stopTimer]);

  const exportResults = useCallback(() => {
    if (rawLines.length === 0) { showMessage('Nothing to export'); return; }
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `lazyscan-${ts}.txt`;
    writeFileSync(filename, rawLines.join('\n'));
    showMessage(`Saved to ${filename}`);
  }, [rawLines, showMessage]);

  useEffect(() => {
    const c = client.current;

    c.on('line', (line: string) => {
      setRawLines(prev => {
        const next = [...prev, line];
        if (autoScrollRef.current) {
          setScrollOffset(Math.max(0, next.length - VISIBLE_LINES));
        }
        return next;
      });
    });

    c.on('host', (host: Host) => {
      setHosts(prev => {
        const next = (() => {
          const idx = prev.findIndex(h => h.ip === host.ip);
          if (idx >= 0) { const a = [...prev]; a[idx] = host; return a; }
          return [...prev, host];
        })();
        if (autoScrollRef.current) {
          setScrollOffset(Math.max(0, flattenHosts(next).length - VISIBLE_LINES));
        }
        return next;
      });
    });

    c.on('done', () => {
      setIsScanning(false);
      stopTimer();
      showMessage('Scan complete');
    });

    return () => { c.kill(); stopTimer(); if (messageTimerRef.current) clearTimeout(messageTimerRef.current); };
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

    if (input === 'q') { client.current.kill(); exit(); return; }

    if (input === 'j' && !isScanning) setSelectedIndex(i => (i + 1) % SCAN_TYPES.length);
    if (input === 'k' && !isScanning) setSelectedIndex(i => (i - 1 + SCAN_TYPES.length) % SCAN_TYPES.length);

    if (key.upArrow) {
      autoScrollRef.current = false;
      setScrollOffset(s => Math.max(0, s - 1));
      return;
    }
    if (key.downArrow) {
      setScrollOffset(s => {
        const totalLines = rawLines.length;
        const maxOffset = Math.max(0, totalLines - VISIBLE_LINES);
        const next = Math.min(maxOffset, s + 1);
        if (next >= maxOffset) autoScrollRef.current = true;
        return next;
      });
      return;
    }

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
            scrollOffset={scrollOffset}
            visibleLines={VISIBLE_LINES}
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
