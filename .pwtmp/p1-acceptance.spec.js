const { test, expect } = require('@playwright/test');

const WEB = 'http://127.0.0.1:3002';
const API = 'http://127.0.0.1:6062';

test('P1 browser acceptance', async ({ page, request }) => {
  await page.goto(`${WEB}/login`, { waitUntil: 'networkidle' });
  await page.locator('input[placeholder="admin"]').first().fill('admin');
  await page.locator('input[type="password"]').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('**/admin', { timeout: 15000 });

  await expect(page.getByText('网易云播放配置（管理员）')).toBeVisible();

  await page.getByRole('button', { name: '扫码登录网易云（推荐）' }).click();
  await expect(page.getByText('二维码已生成，请用网易云音乐 App 扫码并确认。')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('img[alt="网易云扫码登录二维码"]')).toBeVisible();

  const playlistInput = page.locator('input[placeholder="例如：3778678"]');
  await playlistInput.fill('3778678');
  await page.getByRole('button', { name: '保存默认歌单' }).click();
  await expect(page.getByText('默认歌单 ID 已更新，播放器首次加载将使用该歌单。')).toBeVisible({ timeout: 10000 });

  const defaultPlaylistRes = await request.get(`${API}/music/playlist/default`);
  const defaultPlaylistJson = await defaultPlaylistRes.json();
  expect(defaultPlaylistRes.status()).toBe(200);
  expect(defaultPlaylistJson.code).toBe(200);
  expect(Number(defaultPlaylistJson.data.id)).toBe(3778678);
  expect((defaultPlaylistJson.data.tracks || []).length).toBeGreaterThan(0);

  const listRes = await request.get(`${API}/article/list?page=1&pageSize=1`);
  const listJson = await listRes.json();
  const articleId = listJson.rows[0].id;
  await page.goto(`${WEB}/posts/${articleId}`, { waitUntil: 'networkidle' });

  const bgStable = await page.evaluate(() => {
    const bgLayer = document.querySelector('div.fixed.inset-0.z-0.pointer-events-none > div.absolute.inset-0.bg-cover.bg-center.bg-no-repeat');
    if (!bgLayer) return false;
    const before = getComputedStyle(bgLayer).backgroundImage;
    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'instant' });
    const after = getComputedStyle(bgLayer).backgroundImage;
    return !!before && before !== 'none' && before === after;
  });
  expect(bgStable).toBeTruthy();
});
