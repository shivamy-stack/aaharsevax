import https from 'https';

async function testGet(path) {
  return new Promise((resolve) => {
    https.get(`https://aaharseva-x-three.vercel.app${path}`, (res) => {
      console.log(`GET ${path} - Status: ${res.statusCode}`);
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          console.log(`  ✓ Response: Array of ${data.length} items`);
          if (data.length > 0) {
            console.log(`  First item:`, JSON.stringify(data[0]).substring(0, 100));
          }
        } catch (e) {
          console.log(`  Error parsing:`, body.substring(0, 100));
        }
        resolve();
      });
    }).on('error', (e) => {
      console.log(`GET ${path} - ERROR:`, e.message);
      resolve();
    });
  });
}

(async () => {
  await testGet('/api/donations');
  await testGet('/api/ngo-requests');
  await testGet('/api/inventory');
  process.exit(0);
})();
