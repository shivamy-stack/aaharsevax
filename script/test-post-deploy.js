import https from 'https';

const data = JSON.stringify({
  donorName: 'sewa',
  contactNumber: '9876543210',
  foodType: 'Cooked',
  quantity: 'Meals for 5 people',
  city: 'Pune',
  area: 'wagholi',
  isFresh: true
});

const options = {
  hostname: 'aaharseva-x-three.vercel.app',
  port: 443,
  path: '/api/donations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = https.request(options, (res) => {
  console.log('STATUS', res.statusCode);
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => { console.log('BODY', body); });
});

req.on('error', (e) => { console.error('ERROR', e.message); });
req.write(data);
req.end();
