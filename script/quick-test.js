import https from 'https';

https.get('https://aaharseva-x-three.vercel.app/api/ngo-requests', (res) => {
  console.log('GET /api/ngo-requests - Status:', res.statusCode);
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const data = JSON.parse(body);
        console.log('✓ Response is valid JSON:', Array.isArray(data) ? `Array (${data.length} items)` : typeof data);
      } catch (e) {
        console.log('Response:', body.substring(0, 200));
      }
    } else {
      console.log('Error:', body.substring(0, 200));
    }
    process.exit(0);
  });
}).on('error', (e) => {
  console.log('Connection error:', e.message);
  process.exit(1);
});
