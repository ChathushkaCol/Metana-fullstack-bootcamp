// e2e/utils/driver.js
// Uses Selenium Manager (no chromedriver import needed)

const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function buildDriver() {
  const options = new chrome.Options();

  // headless by default; run E2E_HEADFUL=1 npm run e2e to see the UI
  if (process.env.E2E_HEADFUL !== "1") {
    options.addArguments("--headless=new");
  }

  options.addArguments(
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--window-size=1280,800"
  );

  if (process.env.CHROME_BINARY) {
    options.setChromeBinaryPath(process.env.CHROME_BINARY);
  }

  return await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}

module.exports = { buildDriver };
