import { chromium } from '@playwright/test';
import { spawn } from 'child_process';

// Start dev server
console.log('Starting dev server...');
const server = spawn('bun', ['run', 'dev'], {
  cwd: '/home/user/Profile',
  env: { ...process.env, PORT: '3000' }
});

let serverReady = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('[Server]', output);
  if (output.includes('Ready in') || output.includes('Local:')) {
    serverReady = true;
  }
});

server.stderr.on('data', (data) => {
  console.error('[Server Error]', data.toString());
});

// Wait for server to be ready
await new Promise((resolve) => {
  const checkInterval = setInterval(() => {
    if (serverReady) {
      clearInterval(checkInterval);
      resolve();
    }
  }, 500);

  // Timeout after 30 seconds
  setTimeout(() => {
    clearInterval(checkInterval);
    resolve();
  }, 30000);
});

console.log('Server should be ready, waiting 2 more seconds...');
await new Promise(resolve => setTimeout(resolve, 2000));

// Launch browser and inspect
console.log('\nLaunching browser...');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

// Listen to console messages
page.on('console', msg => {
  console.log(`[Browser Console ${msg.type()}]:`, msg.text());
});

// Listen to page errors
page.on('pageerror', error => {
  console.error('[Browser Error]:', error.message);
});

try {
  console.log('Navigating to http://localhost:3000/en...');
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle', timeout: 30000 });

  console.log('\n=== Checking AnimatedBackground ===');

  // Check if AnimatedBackground component exists
  const backgroundDiv = await page.locator('div.fixed.inset-0.-z-10').first();
  const exists = await backgroundDiv.count() > 0;
  console.log('AnimatedBackground div exists:', exists);

  if (exists) {
    const isVisible = await backgroundDiv.isVisible();
    console.log('AnimatedBackground is visible:', isVisible);

    // Get computed styles
    const opacity = await backgroundDiv.evaluate(el => window.getComputedStyle(el).opacity);
    const zIndex = await backgroundDiv.evaluate(el => window.getComputedStyle(el).zIndex);
    const position = await backgroundDiv.evaluate(el => window.getComputedStyle(el).position);

    console.log('Computed styles:', { opacity, zIndex, position });

    // Check for SVG
    const svg = await page.locator('svg').first();
    const svgExists = await svg.count() > 0;
    console.log('SVG exists:', svgExists);

    if (svgExists) {
      const svgHTML = await svg.evaluate(el => el.outerHTML.substring(0, 500));
      console.log('SVG HTML (first 500 chars):', svgHTML);
    }

    // Check for gradient divs
    const gradientDivs = await page.locator('div.blur-3xl').count();
    console.log('Number of blur-3xl gradient divs:', gradientDivs);

    // Get background HTML
    const bgHTML = await backgroundDiv.evaluate(el => el.outerHTML.substring(0, 1000));
    console.log('\nBackground HTML (first 1000 chars):', bgHTML);
  }

  console.log('\n=== Checking Page Structure ===');

  // Check body background
  const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).background);
  console.log('Body background:', bodyBg);

  // Check if hero section exists
  const heroSection = await page.locator('section#hero').count();
  console.log('Hero section exists:', heroSection > 0);

  // Take screenshot
  console.log('\nTaking screenshot...');
  await page.screenshot({ path: '/home/user/Profile/page-screenshot.png', fullPage: false });
  console.log('Screenshot saved to page-screenshot.png');

  // Get all elements with background styles
  const elementsWithBg = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    return elements
      .map(el => {
        const styles = window.getComputedStyle(el);
        const bg = styles.background;
        const bgColor = styles.backgroundColor;
        if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'none' || bgColor !== 'rgba(0, 0, 0, 0)') {
          return {
            tag: el.tagName,
            classes: el.className,
            background: bg.substring(0, 100),
            backgroundColor: bgColor
          };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 20);
  });

  console.log('\n=== Elements with backgrounds (first 20) ===');
  console.log(JSON.stringify(elementsWithBg, null, 2));

} catch (error) {
  console.error('Error during inspection:', error.message);
} finally {
  await browser.close();
  server.kill();
  console.log('\nTest complete.');
}
