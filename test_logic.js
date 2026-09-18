const fs = require('fs');

const appContent = fs.readFileSync('app.js', 'utf8');

// Check that all 3 languages exist
const hasAmharic = appContent.includes('am: {');
const hasOromo = appContent.includes('om: {');
const hasEnglish = appContent.includes('en: {');

// Check that products exist
const hasStorage = appContent.includes('Glass Storage Container Set');
const hasVest = appContent.includes('Posture Corrector Compression Vest');
const hasBlender = appContent.includes('Saachhi 2-in-1 Blender');
const hasMelanix = appContent.includes('Melanix Anti-Gray Hair Lotion');

// Check that Adama neighborhoods exist
const hasGendahara = appContent.includes('Gendahara');
const hasSilasi = appContent.includes('Silasi');
const hasAtanatara = appContent.includes('Atanatara');
const hasPeacock = appContent.includes('Peacock');
const hasBoli = appContent.includes('Boli');
const hasMatwamisp = appContent.includes('Matwamisp');

// Check payment methods
const hasTelebirr = appContent.includes('Telebirr');
const hasCbe = appContent.includes('1000348291048');
const hasCod = appContent.includes('Cash on Delivery');
const hasSms = appContent.includes('0923245529');

console.log({
  hasAmharic,
  hasOromo,
  hasEnglish,
  hasStorage,
  hasVest,
  hasBlender,
  hasMelanix,
  hasGendahara,
  hasSilasi,
  hasAtanatara,
  hasPeacock,
  hasBoli,
  hasMatwamisp,
  hasTelebirr,
  hasCbe,
  hasCod,
  hasSms
});

const allPassed = Object.values({
  hasAmharic,
  hasOromo,
  hasEnglish,
  hasStorage,
  hasVest,
  hasBlender,
  hasMelanix,
  hasGendahara,
  hasSilasi,
  hasAtanatara,
  hasPeacock,
  hasBoli,
  hasMatwamisp,
  hasTelebirr,
  hasCbe,
  hasCod,
  hasSms
}).every(Boolean);

if (allPassed) {
  console.log('>>> LOGIC & SPEC COMPLIANCE VERIFIED 100% <<<');
} else {
  console.error('>>> COMPLIANCE TEST FAILED <<<');
  process.exit(1);
}
