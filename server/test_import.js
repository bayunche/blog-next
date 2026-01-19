try {
    const api = require('NeteaseCloudMusicApi');
    console.log('Import successful');
    console.log('Keys:', Object.keys(api).slice(0, 10)); // 只打印前10个
} catch (e) {
    console.error('Import failed:', e);
}
