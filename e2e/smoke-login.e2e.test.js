const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE = (process.env.E2E_BASE_URL || "http://localhost:5173").replace(/\/$/, "");
const CANDIDATES = ["/", "/index.html", "/login.html"];

function buildDriver() {
  const opts = new chrome.Options();
  if (process.env.E2E_HEADFUL !== "1") opts.addArguments("--headless=new");
  opts.addArguments("--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--window-size=1280,800");
  return new Builder().forBrowser("chrome").setChromeOptions(opts).build();
}

jest.setTimeout(120000);

describe("Login flow (E2E)", () => {
  let driver;
  beforeAll(async () => { driver = buildDriver(); });
  afterAll(async () => { try { await driver?.quit(); } catch {} });

  test("renders login form and submits", async () => {
    console.log("MARKER_V6: starting");

    let mounted = false;
    for (const p of CANDIDATES) {
      const url = `${BASE}${p}`;
      await driver.get(url);

      // wait for HTML
      await driver.wait(async () => {
        const rs = await driver.executeScript("return document.readyState");
        return rs === "interactive" || rs === "complete";
      }, 30000);

      // prefer explicit flag set by client/src/login.jsx
      try {
        await driver.wait(
          async () => await driver.executeScript("return document.body.getAttribute('data-e2e') === 'mounted'"),
          8000
        );
        mounted = true;
        break;
      } catch {
        // fallback: #root has children
        try {
          await driver.wait(async () => {
            return await driver.executeScript(`
              const r = document.getElementById('root');
              return !!(r && r.children && r.children.length > 0);
            `);
          }, 8000);
          mounted = true;
          break;
        } catch {}
      }
    }

    if (!mounted) {
      const loc = await driver.getCurrentUrl();
      const snap = await driver.executeScript("return document.documentElement.outerHTML.slice(0, 800)");
      throw new Error("App did not mount. URL: " + loc + "\nSNAP:\n" + snap);
    }

    const email = await driver.wait(
      until.elementLocated(By.css("#email, input[aria-label='email'], input[type='email'], input[name='email']")),
      30000
    );
    const pw = await driver.wait(
      until.elementLocated(By.css("#password, input[aria-label='password'], input[type='password'], input[name='password']")),
      30000
    );
    const btn = await driver.wait(
      until.elementLocated(By.css("button[type='submit'], form button")),
      30000
    );

    await email.clear(); await email.sendKeys("a@b.com");
    await pw.clear();    await pw.sendKeys("pw");
    await btn.click();

    await driver.wait(until.elementLocated(By.css("#alert, [role='alert'], .error, .success")), 30000);
  });
});
