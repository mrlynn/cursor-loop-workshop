import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import YAML from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.join(__dirname, '..', 'manifest.yaml');

export function loadManifest() {
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf8');
  const manifest = YAML.parse(raw);
  if (!manifest?.scenes?.length) {
    throw new Error('manifest.yaml must define at least one scene');
  }
  return manifest;
}

export function resolveOutputPath(manifest, scene, siteRoot) {
  const root = path.resolve(siteRoot, scene.output_root ?? manifest.defaults?.output_root ?? 'static/img/screenshots');
  const section = scene.section ?? 'misc';
  const filename = scene.output ?? `${scene.id}.png`;
  return path.join(root, section, filename);
}
