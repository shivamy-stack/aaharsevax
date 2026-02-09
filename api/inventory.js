import postgres from 'postgres';

let db = null;

function getDb() {
  if (!db && process.env.DATABASE_URL) {
    db = postgres(process.env.DATABASE_URL, {
      ssl: 'require',
      max: 1,
      idle_timeout: 10,
      connect_timeout: 10,
    });
  }
  return db;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const database = getDb();
      if (!database) {
        return res.status(503).json({ message: 'Database not configured' });
      }

      const now = new Date();
      const results = await database`
        SELECT id, donor_name as "donorName", contact_number as "contactNumber",
               food_type as "foodType", quantity, city, area, is_fresh as "isFresh",
               status, safe_until as "safeUntil", created_at as "createdAt"
        FROM donations
        WHERE status = 'available' 
        AND (safe_until IS NULL OR safe_until > ${now})
        ORDER BY created_at DESC
      `;
      
      return res.status(200).json(results);
    }

    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    console.error('inventory handler error:', err?.message || err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
