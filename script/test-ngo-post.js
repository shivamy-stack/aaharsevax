import https from 'https';

const data = JSON.stringify({
  ngoName: 'Test NGO',
  contactNumber: '9876543210',
  requirements: 'Food for 100 children',
  city: 'Delhi'
});

const options = {
  hostname: 'aaharseva-x-three.vercel.app',
  port: 443,
  path: '/api/ngo-requests',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = https.request(options, (res) => {
  console.log('POST /api/ngo-requests');
  console.log('Status:', res.statusCode);
  
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
