import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const IMAGES_DIR = './public/images';
const QUALITY = 82;

const targets = [
  'ConstellationBackground.png',
  'Grow.png',
  'logo.png',
  'HarperPropertyServices.png',
  'projectsBackground.jpg',
  'SurvivorSocial.png',
  'SurvivorChallenge.png',
  'SurvivorScreen.png',
  'SignalaDashboard.png',
  'SignalaChartAgent.png',
  'SignalaTools.png',
  'cover.webp',
  'educationBackground.webp',
];

for (const file of targets) {
  const src = join(IMAGES_DIR, file);
  const ext = extname(file);
  const name = basename(file, ext);
  const dest = join(IMAGES_DIR, `${name}.webp`);

  // Skip if already webp and same name
  if (ext === '.webp' && file === `${name}.webp`) {
    console.log(`skipping ${file} (already webp)`);
    continue;
  }

  try {
    const info = await sharp(src)
      .webp({ quality: QUALITY })
      .toFile(dest);
    const before = statSync(src).size;
    console.log(`${file} → ${name}.webp  ${(before/1024).toFixed(0)}KB → ${(info.size/1024).toFixed(0)}KB`);
  } catch (e) {
    console.error(`failed: ${file}`, e.message);
  }
}
