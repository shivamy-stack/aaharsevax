import https from 'https';

https.get('https://aaharseva-x-three.vercel.app/api/ngo-requests', (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => { 
    console.log('GET /api/ngo-requests STATUS:', res.statusCode);
    if (body) console.log('RESPONSE:', body.substring(0, 500));
  });
}).on('error', (e) => { console.error('ERROR', e.message); });
