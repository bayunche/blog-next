// @ts-check
module.exports = {
  testDir: '.',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  reporter: 'line',
  use: {
    headless: true,
    browserName: 'chromium'
  }
}
