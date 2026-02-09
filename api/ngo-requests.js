import postgres from 'postgres';
import { z } from 'zod';

// Validation schema
const insertNgoRequestSchema = z.object({
  ngoName: z.string().min(1, "NGO name is required"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  requirements: z.string().min(1, "Requirements are required"),
  city: z.enum(["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Other"])
});

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

      const results = await database`
        SELECT id, ngo_name as "ngoName", contact_number as "contactNumber", 
               requirements, city, status, created_at as "createdAt"
        FROM ngo_requests
        ORDER BY created_at DESC
      `;
      
      return res.status(200).json(results);
    }

    if (req.method === 'POST') {
      try {
        const input = insertNgoRequestSchema.parse(req.body);
        
        const database = getDb();
        if (!database) {
          return res.status(503).json({ message: 'Database not configured' });
        }

        const result = await database`
          INSERT INTO ngo_requests (ngo_name, contact_number, requirements, city, status, created_at)
          VALUES (${input.ngoName}, ${input.contactNumber}, ${input.requirements}, ${input.city}, 'open', NOW())
          RETURNING id, ngo_name as "ngoName", contact_number as "contactNumber", 
                    requirements, city, status, created_at as "createdAt"
        `;
        
        return res.status(201).json(result[0]);
      } catch (err) {
        if (err instanceof z.ZodError) {
          const issue = err.errors[0];
          return res.status(400).json({ 
            message: issue.message, 
            field: issue.path.join('.') 
          });
        }
        throw err;
      }
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    console.error('ngo-requests handler error:', err?.message || err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
