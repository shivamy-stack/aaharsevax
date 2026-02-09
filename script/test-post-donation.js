import http from 'http';

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
  hostname: 'localhost',
  port: 5000,
  path: '/api/donations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log('BODY', body);
  });
});

req.on('error', (e) => { console.error('ERROR', e.message); });
req.write(data);
req.end();
