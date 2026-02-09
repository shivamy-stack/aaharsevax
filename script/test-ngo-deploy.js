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
  console.log('NGO POST STATUS:', res.statusCode);
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => { 
    console.log('NGO POST RESPONSE:', body);
  });
});

req.on('error', (e) => { console.error('ERROR', e.message); });
req.write(data);
req.end();
