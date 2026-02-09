import https from 'https';

const data = JSON.stringify({
  donorName: 'Test Donor',
  contactNumber: '9876543210',
  foodType: 'Cooked',
  quantity: 'Meals for 10',
  city: 'Mumbai',
  area: 'Andheri',
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
  console.log('POST /api/donations');
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    console.log('Response:', body);
    process.exit(res.statusCode === 201 ? 0 : 1);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
  process.exit(1);
});

console.log('Sending:', data);
req.write(data);
req.end();
