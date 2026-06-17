#!/usr/bin/env node
/**
 * Run screenshot scenes from manifest.yaml.
 *
 * Usage:
 *   node lib/run-scenes.mjs --all
 *   node lib/run-scenes.mjs --scene indexing-status-bar
 *   node lib/run-scenes.mjs --list
 *
 * Options:
 *   --site-root <path>   Docusaurus site root (default: cwd or parent with static/)
 *   --interactive        Pause before each capture for manual UI setup (default: true)
 *   --yes                Skip interactive prompts
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import {fileURLToPath} from 'node:url';
import {loadManifest, resolveOutputPath} from './read-manifest.mjs';
import {
  assertMacOS,
  activateApp,
  captureScreen,
  captureWindow,
  runSteps,
} from './macos.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = {
    all: false,
    list: false,
    interactive: true,
    sceneIds: [],
    siteRoot: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--all') args.all = true;
    else if (arg === '--list') args.list = true;
    else if (arg === '--yes' || arg === '--no-interactive') args.interactive = false;
    else if (arg === '--interactive') args.interactive = true;
    else if (arg === '--scene') args.sceneIds.push(argv[++i]);
    else if (arg === '--site-root') args.siteRoot = path.resolve(argv[++i]);
  }
  return args;
}

function detectSiteRoot(explicit) {
  if (explicit) return explicit;
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'static'))) return cwd;
  if (fs.existsSync(path.join(cwd, 'site', 'static'))) return path.join(cwd, 'site');
  if (fs.existsSync(path.join(cwd, '..', 'static'))) return path.resolve(cwd, '..');
  return cwd;
}

function waitForEnter(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});
    rl.question(prompt, () => {
      rl.close();
      resolve();
    });
  });
}

async function captureScene(manifest, scene, siteRoot, interactive) {
  const appName = scene.app ?? manifest.defaults?.app ?? 'Cursor';
  const captureMode = scene.capture ?? manifest.defaults?.capture ?? 'window';
  const outPath = resolveOutputPath(manifest, scene, siteRoot);
  fs.mkdirSync(path.dirname(outPath), {recursive: true});

  console.log(`\n▸ ${scene.id}`);
  console.log(`  doc: ${scene.doc ?? '—'}`);
  console.log(`  → ${outPath}`);
  if (scene.interactive_hint) {
    console.log(`  hint: ${scene.interactive_hint}`);
  }

  if (interactive) {
    await waitForEnter('  Position Cursor UI, then press Enter to capture (Ctrl+C to skip run)... ');
  }

  if (scene.steps?.length) {
    await runSteps(scene.steps, appName);
  } else {
    activateApp(appName);
  }

  if (captureMode === 'screen') {
    captureScreen(outPath);
  } else {
    captureWindow(outPath, appName);
  }

  console.log(`  ✓ saved ${outPath}`);
  return outPath;
}

async function main() {
  assertMacOS();
  const args = parseArgs(process.argv);
  const manifest = loadManifest();
  const siteRoot = detectSiteRoot(args.siteRoot);

  if (args.list) {
    for (const scene of manifest.scenes) {
      console.log(`${scene.id}\t${scene.section}\t${scene.doc ?? ''}`);
    }
    return;
  }

  let scenes = manifest.scenes;
  if (args.sceneIds.length) {
    scenes = scenes.filter((s) => args.sceneIds.includes(s.id));
    if (!scenes.length) {
      throw new Error(`No scenes matched: ${args.sceneIds.join(', ')}`);
    }
  } else if (!args.all) {
    console.log('Pass --all or --scene <id>. Use --list to see scene ids.');
    process.exit(1);
  }

  console.log(`Site root: ${siteRoot}`);
  console.log(`Capturing ${scenes.length} scene(s)...`);
  console.log('Requires: Cursor open, dark theme, Screen Recording permission for Terminal.');

  const saved = [];
  for (const scene of scenes) {
    try {
      saved.push(await captureScene(manifest, scene, siteRoot, args.interactive));
    } catch (err) {
      console.error(`  ✗ ${scene.id}: ${err.message}`);
    }
  }

  console.log(`\nDone. ${saved.length}/${scenes.length} saved.`);
  if (saved.length) {
    console.log('Embed in MDX:');
    console.log('  <CursorScreenshot src="/img/screenshots/<section>/<file>.png" alt="..." caption="..." />');
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
