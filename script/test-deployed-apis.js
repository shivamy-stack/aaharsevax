import https from 'https';

const endpoints = [
  '/api/ngo-requests',
  '/api/donations',
  '/api/inventory'
];

async function testEndpoint(path) {
  return new Promise((resolve) => {
    https.get(`https://aaharseva-x-three.vercel.app${path}`, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => {
        console.log(`${path}: Status ${res.statusCode}`);
        if (res.statusCode !== 200) {
          console.log(`  Error: ${body.substring(0, 100)}`);
        } else {
          try {
            const data = JSON.parse(body);
            console.log(`  ✓ Response: ${Array.isArray(data) ? data.length + ' items' : 'object'}`);
          } catch (e) {
            console.log(`  Response: ${body.substring(0, 100)}`);
          }
        }
        resolve();
      });
    }).on('error', (e) => {
      console.log(`${path}: ERROR - ${e.message}`);
      resolve();
    });
  });
}

(async () => {
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
})();
