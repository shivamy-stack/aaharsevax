import https from 'https';

https.get('https://aaharseva-x-three.vercel.app/api/donations', (res) => {
  console.log('STATUS', res.statusCode);
  console.log('HEADERS', res.headers);
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => { console.log('BODY', body); });
}).on('error', (e) => { console.error('ERR', e); });
