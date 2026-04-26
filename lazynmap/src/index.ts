#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { App } from './App.js';

process.stdout.write('\x1b[?1049h');
process.stdout.write('\x1b[H');

const cleanup = () => { process.stdout.write('\x1b[?1049l'); };
process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(0); });
process.on('SIGTERM', () => { cleanup(); process.exit(0); });

const { waitUntilExit } = render(React.createElement(App));
waitUntilExit().then(() => { cleanup(); process.exit(0); });
