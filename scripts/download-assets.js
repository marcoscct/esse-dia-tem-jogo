/* eslint-disable */
const fs = require('fs');
const path = require('path');

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed with status ${res.status}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.error(`Error downloading ${url} to ${destPath}:`, err.message);
    return false;
  }
}

// Concurrency helper
async function pLimit(items, limit, fn) {
  const results = [];
  const executing = new Set();
  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    results.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean, clean);
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

async function main() {
  const flagsCodesPath = path.join(__dirname, '..', 'src', 'lib', 'flag-codes.ts');
  const code = fs.readFileSync(flagsCodesPath, 'utf8');

  // Extract TEAM_TO_ISO
  const teamToIsoMatch = code.match(/const TEAM_TO_ISO: Record<string, string> = {([\s\S]*?)};/);
  if (!teamToIsoMatch) {
    console.error("Could not find TEAM_TO_ISO in flag-codes.ts");
    return;
  }
  
  // Extract CLUB_BADGES
  const clubBadgesMatch = code.match(/const CLUB_BADGES: Record<string, string> = {([\s\S]*?)};/);
  if (!clubBadgesMatch) {
    console.error("Could not find CLUB_BADGES in flag-codes.ts");
    return;
  }

  // Parse TEAM_TO_ISO lines
  const teamToIso = {};
  teamToIsoMatch[1].split('\n').forEach(line => {
    const m = line.match(/^\s*([A-Z0-9_]+):\s*["']([^"']+)["']/i);
    if (m) {
      teamToIso[m[1].trim().toUpperCase()] = m[2].trim().toLowerCase();
    }
  });

  // Parse CLUB_BADGES lines
  const clubBadges = {};
  clubBadgesMatch[1].split('\n').forEach(line => {
    const m = line.match(/^\s*([A-Z0-9_]+):\s*["']([^"']+)["']/i);
    if (m) {
      clubBadges[m[1].trim().toUpperCase()] = m[2].trim();
    }
  });

  console.log(`Parsed ${Object.keys(teamToIso).length} teams and ${Object.keys(clubBadges).length} clubs.`);

  // Ensure folders exist
  const flagsDir = path.join(__dirname, '..', 'public', 'flags');
  const badgesDir = path.join(__dirname, '..', 'public', 'badges');
  if (!fs.existsSync(flagsDir)) fs.mkdirSync(flagsDir, { recursive: true });
  if (!fs.existsSync(badgesDir)) fs.mkdirSync(badgesDir, { recursive: true });

  // Prepare download queue
  const queue = [];

  // Add flags (national teams)
  for (const [teamCode, iso] of Object.entries(teamToIso)) {
    const url = `https://hatscripts.github.io/circle-flags/flags/${iso}.svg`;
    const dest = path.join(flagsDir, `${teamCode.toLowerCase()}.svg`);
    queue.push({ type: 'flag', code: teamCode, url, dest });
  }

  // Add badges (clubs)
  for (const [clubCode, url] of Object.entries(clubBadges)) {
    const dest = path.join(badgesDir, `${clubCode.toLowerCase()}.svg`);
    queue.push({ type: 'badge', code: clubCode, url, dest });
  }

  console.log(`Starting download of ${queue.length} assets...`);

  let succeeded = 0;
  let failed = 0;

  await pLimit(queue, 5, async (item) => {
    const success = await downloadFile(item.url, item.dest);
    if (success) {
      succeeded++;
    } else {
      failed++;
    }
  });

  console.log(`Downloads finished. Succeeded: ${succeeded}, Failed: ${failed}.`);
}

main().catch(console.error);
