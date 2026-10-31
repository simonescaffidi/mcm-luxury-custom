const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const { execSync } = require('child_process');

execSync('node scripts/build.js');
for (const f of ['index', 'privacy-policy', 'cookie-policy']) {
  for (const dir of ['public/', 'public/en/']) {
    test(`${dir}${f}.html rispetta lo standard`, () => {
      const h = fs.readFileSync(`${dir}${f}.html`, 'utf8');
      assert.match(h, /Powered by <a href="https:\/\/www\.simonescaffidi\.it"/);
      assert.match(h, /<!--GSC-->/);
      assert.match(h, /hreflang="it"/);
      assert.match(h, /hreflang="en"/);
      assert.strictEqual((h.match(/<h1[ >]/g) || []).length, 1);
      assert.match(h, /id="cookie-banner"/);
      assert.match(h, /<meta name="description"/);
    });
  }
}
