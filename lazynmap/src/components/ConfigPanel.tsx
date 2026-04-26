import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import type { ScanType } from '../types.js';
import { SCAN_TYPES, SCAN_TYPE_LABELS, SCAN_TYPE_FLAGS_DISPLAY } from '../types.js';

interface ConfigPanelProps {
  target: string;
  scanType: ScanType;
  customFlags: string;
  selectedIndex: number;
  targetFocused: boolean;
  customFlagsFocused: boolean;
  isScanning: boolean;
  onTargetChange: (val: string) => void;
  onCustomFlagsChange: (val: string) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  target, scanType, customFlags, selectedIndex,
  targetFocused, customFlagsFocused, isScanning,
  onTargetChange, onCustomFlagsChange,
}) => (
  <Box flexDirection="column" width={26} paddingX={1}>
    <Text color="gray">Target:</Text>
    <Box marginBottom={1}>
      {targetFocused
        ? <TextInput value={target} onChange={onTargetChange} />
        : <Text color={target ? 'green' : 'gray'}>{target || 'enter target...'}</Text>
      }
    </Box>

    <Text color="gray">Scan type:</Text>
    {SCAN_TYPES.map((type, i) => {
      const isSelected = i === selectedIndex;
      return (
        <Box key={type}>
          <Text color={isSelected ? 'yellow' : 'gray'}>{isSelected ? '▶ ' : '  '}</Text>
          <Text color={isSelected ? 'yellow' : 'gray'} bold={isSelected}>
            {SCAN_TYPE_LABELS[type]}
          </Text>
          {type === 'os'   && <Text color="red">  ⚠</Text>}
          {type === 'vuln' && <Text color="magenta">  ~</Text>}
        </Box>
      );
    })}

    <Box marginTop={1}>
      <Text color="gray">Flags: </Text>
      <Text color="magenta">
        {scanType === 'custom'
          ? (customFlags || 'none')
          : SCAN_TYPE_FLAGS_DISPLAY[scanType]
        }
      </Text>
    </Box>

    {scanType === 'custom' && (
      <Box marginBottom={1}>
        <Text color="gray">Custom: </Text>
        {customFlagsFocused
          ? <TextInput value={customFlags} onChange={onCustomFlagsChange} />
          : <Text color="cyan">{customFlags || '[tab to edit]'}</Text>
        }
      </Box>
    )}

    {scanType === 'os'   && <Text color="red"    dimColor>⚠ requires sudo</Text>}
    {scanType === 'vuln' && <Text color="magenta" dimColor>~ raw view only</Text>}

    <Box
      marginTop={1}
      borderStyle="single"
      borderColor={isScanning ? 'gray' : 'cyan'}
      paddingX={1}
    >
      <Text color={isScanning ? 'gray' : 'cyan'} bold>
        {isScanning ? '■ STOP  [x]' : '▶ RUN  [⏎]'}
      </Text>
    </Box>
  </Box>
);
