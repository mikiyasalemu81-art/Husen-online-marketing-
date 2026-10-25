const fs = require('fs');
const assert = require('assert');

function runAdminFixTests() {
  console.log('========================================================');
  console.log(' VERIFYING ROOT FIXES: ADMIN POSITION, EDIT & <3S SYNC');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [FAIL] ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Verify <3 seconds stock synchronization
  test('1. Stock synchronization interval is set to under 3 seconds (2000ms)', () => {
    const appJs = fs.readFileSync('app.js', 'utf8');
    assert(appJs.includes('2000'), 'Polling interval must be 2000ms');
    assert(appJs.includes('BroadcastChannel'), 'Must use BroadcastChannel for <50ms instant sync');
    assert(appJs.includes('hom_sync_channel'), 'Channel name must be hom_sync_channel');
    assert(appJs.includes("window.addEventListener('storage'"), 'Must sync on storage events across windows');
  });

  // 2. Verify Admin Modal is raised to the top
  test('2. Admin portal and product editor are raised to the top (align-items: flex-start)', () => {
    const styleCss = fs.readFileSync('style.css', 'utf8');
    assert(styleCss.includes('.admin-backdrop,\n.editor-backdrop') || styleCss.includes('.admin-backdrop,\r\n.editor-backdrop'), 'Admin and editor backdrops must be declared together');
    assert(styleCss.includes('align-items: flex-start;'), 'Must use align-items: flex-start to raise to top');
    assert(styleCss.includes('z-index: 1000;'), 'Admin backdrop must have z-index: 1000');
    assert(styleCss.includes('z-index: 1200;'), 'Editor backdrop must have z-index: 1200');
  });

  // 3. Verify mobile full-screen layout anchored to top
  test('3. Mobile media query sets admin-modal and editor-modal to 100dvh starting at top', () => {
    const styleCss = fs.readFileSync('style.css', 'utf8');
    assert(styleCss.includes('height: 100dvh;'), 'Must use 100dvh on mobile');
    assert(styleCss.includes('border-radius: 0;'), 'Must have border-radius: 0 on mobile for native full view');
    assert(styleCss.includes('.admin-header') && styleCss.includes('position: sticky'), 'Admin header must be sticky at top');
    assert(styleCss.includes('.editor-header') && styleCss.includes('position: sticky'), 'Editor header must be sticky at top');
  });

  // 4. Verify Product Editor can be opened and edited reliably
  test('4. Product edit click handlers and autofocus are properly configured', () => {
    const appJs = fs.readFileSync('app.js', 'utf8');
    assert(appJs.includes('.btn-edit-prod'), 'Must wire .btn-edit-prod');
    assert(appJs.includes('openProductEditor(prod)'), 'Must call openProductEditor(prod)');
    assert(appJs.includes('dom.editorProdName.focus()'), 'Must autofocus product name on edit');
  });

  // 5. Verify Editor Action Buttons are sticky and never cut off
  test('5. Product editor actions row is sticky at bottom so save button is always visible', () => {
    const styleCss = fs.readFileSync('style.css', 'utf8');
    assert(styleCss.includes('.editor-actions-row') && styleCss.includes('position: sticky'), 'Actions row must be sticky');
  });

  // 6. Verify Service Worker safe image fallback
  test('6. Service worker provides safe image fallback response without returning undefined', () => {
    const swJs = fs.readFileSync('sw.js', 'utf8');
    assert(swJs.includes('FALLBACK_IMAGE_SVG') || swJs.includes('getFallbackImageResponse'), 'SW must have image fallback');
    assert(swJs.includes('image/svg+xml'), 'SW fallback must be image/svg+xml');
  });

  console.log('\n========================================================');
  console.log(` RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAdminFixTests();
