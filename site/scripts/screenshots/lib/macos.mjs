import {execSync, spawnSync} from 'node:child_process';
import {keystrokeAppleScript} from './shortcuts.mjs';

export function assertMacOS() {
  if (process.platform !== 'darwin') {
    throw new Error('capture-macos.sh requires macOS (screencapture + AppleScript)');
  }
}

export function activateApp(appName = 'Cursor') {
  execSync(`osascript -e 'tell application "${appName}" to activate'`, {stdio: 'ignore'});
}

export function getFrontWindowId(appName = 'Cursor') {
  const script = `
    tell application "System Events"
      tell process "${appName}"
        if (count of windows) is 0 then return ""
        return id of front window
      end tell
    end tell`;
  const out = execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, {encoding: 'utf8'}).trim();
  return out || null;
}

export async function runSteps(steps = [], appName = 'Cursor') {
  for (const step of steps) {
    if (typeof step === 'string') {
      if (step === 'activate') {
        activateApp(appName);
        continue;
      }
      if (step.startsWith('wait:')) {
        sleep(Number(step.split(':')[1] ?? '1'));
        continue;
      }
      if (step.startsWith('shortcut:')) {
        runShortcut(step.slice('shortcut:'.length).trim(), appName);
        continue;
      }
      if (step.startsWith('note:')) {
        console.log(`  note: ${step.slice(5).trim()}`);
        continue;
      }
    }
  }
}

function runShortcut(name, appName) {
  activateApp(appName);
  const script = keystrokeAppleScript(name);
  execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, {stdio: 'ignore'});
}

export function sleep(seconds) {
  spawnSync('sleep', [String(seconds)]);
}

export function captureWindow(outputPath, appName = 'Cursor') {
  activateApp(appName);
  sleep(0.3);
  const windowId = getFrontWindowId(appName);
  if (!windowId) {
    throw new Error(`No front window found for ${appName}. Is Cursor open?`);
  }
  execSync(`screencapture -x -o -l${windowId} "${outputPath}"`, {stdio: 'inherit'});
}

export function captureScreen(outputPath) {
  execSync(`screencapture -x -o "${outputPath}"`, {stdio: 'inherit'});
}
