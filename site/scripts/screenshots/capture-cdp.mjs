#!/usr/bin/env node
/**
 * Tier 2 — Playwright CDP capture (optional).
 *
 * Prerequisite: Cursor running with remote debugging:
 *   open -a Cursor --args --remote-debugging-port=9222
 *
 * Usage:
 *   npm run capture:cdp -- --scene agent-scoped-prompt
 *   node capture-cdp.mjs --all --site-root ../site
 */
import fs from 'node:fs';
import path from 'node:path';
import {loadManifest, resolveOutputPath} from './lib/read-manifest.mjs';

const CDP_URL = process.env.CURSOR_CDP_URL ?? 'http://127.0.0.1:9222';

function parseArgs(argv) {
  const args = {all: false, sceneIds: [], siteRoot: process.cwd()};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--all') args.all = true;
    else if (arg === '--scene') args.sceneIds.push(argv[++i]);
    else if (arg === '--site-root') args.siteRoot = path.resolve(argv[++i]);
  }
  return args;
}

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    throw new Error('Install Playwright: npm install playwright (optionalDependency)');
  }
}

async function captureViaCdp(manifest, scene, siteRoot) {
  const {chromium} = await loadPlaywright();
  const browser = await chromium.connectOverCDP(CDP_URL);
  const context = browser.contexts()[0];
  if (!context) throw new Error('No browser context on CDP endpoint. Is Cursor running with --remote-debugging-port=9222?');

  const page = context.pages()[0] ?? (await context.newPage());
  const outPath = resolveOutputPath(manifest, scene, siteRoot);
  fs.mkdirSync(path.dirname(outPath), {recursive: true});
  await page.screenshot({path: outPath, fullPage: false});
  console.log(`✓ CDP saved ${outPath}`);
  await browser.close();
}

async function main() {
  const args = parseArgs(process.argv);
  const manifest = loadManifest();
  let scenes = manifest.scenes;
  if (args.sceneIds.length) {
    scenes = scenes.filter((s) => args.sceneIds.includes(s.id));
  } else if (!args.all) {
    console.log('Pass --all or --scene <id>');
    process.exit(1);
  }

  for (const scene of scenes) {
    try {
      await captureViaCdp(manifest, scene, args.siteRoot);
    } catch (err) {
      console.error(`✗ ${scene.id}: ${err.message}`);
    }
  }
}

main();
