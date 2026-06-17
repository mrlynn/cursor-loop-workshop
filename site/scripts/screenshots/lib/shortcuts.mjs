/** macOS keystroke codes for osascript — VERIFY when Cursor shortcuts change. */
export const SHORTCUTS = {
  'cmd+shift+j': {key: 'j', modifiers: ['command down', 'shift down']},
  'cmd+shift+p': {key: 'p', modifiers: ['command down', 'shift down']},
  'cmd+l': {key: 'l', modifiers: ['command down']},
  'cmd+shift+l': {key: 'l', modifiers: ['command down', 'shift down']},
  'cmd+1': {key: '1', modifiers: ['command down']},
  escape: {keyCode: 53, modifiers: []},
};

export function keystrokeAppleScript(shortcutName) {
  const spec = SHORTCUTS[shortcutName.toLowerCase()];
  if (!spec) {
    throw new Error(`Unknown shortcut: ${shortcutName}. Add it to lib/shortcuts.mjs`);
  }
  if (spec.keyCode != null) {
    return `tell application "System Events" to key code ${spec.keyCode}`;
  }
  const mods = spec.modifiers.length ? ` using {${spec.modifiers.join(', ')}}` : '';
  return `tell application "System Events" to keystroke "${spec.key}"${mods}`;
}
