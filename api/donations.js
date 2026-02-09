import postgres from 'postgres';
import { z } from 'zod';

// Validation schema
const insertDonationSchema = z.object({
  donorName: z.string().min(1, "Donor name is required"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  foodType: z.enum(["Cooked", "Packed"]),
  quantity: z.string().min(1, "Quantity is required"),
  city: z.enum(["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Other"]),
  area: z.string().optional(),
  isFresh: z.boolean().refine(val => val === true, {
    message: "You must confirm the food was prepared within the last two hours."
  })
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
        SELECT id, donor_name as "donorName", contact_number as "contactNumber",
               food_type as "foodType", quantity, city, area, is_fresh as "isFresh",
               status, safe_until as "safeUntil", created_at as "createdAt"
        FROM donations
        ORDER BY created_at DESC
      `;
      
      return res.status(200).json(results);
    }

    if (req.method === 'POST') {
      try {
        const input = insertDonationSchema.parse(req.body);
        
        const database = getDb();
        if (!database) {
          return res.status(503).json({ message: 'Database not configured' });
        }

        // Set safeUntil to 4 hours from now if foodType is Cooked
        const safeUntil = input.foodType === "Cooked" 
          ? new Date(Date.now() + 4 * 60 * 60 * 1000) 
          : null;

        const result = await database`
          INSERT INTO donations (
            donor_name, contact_number, food_type, quantity, city, area, 
            is_fresh, status, safe_until, created_at
          )
          VALUES (
            ${input.donorName}, ${input.contactNumber}, ${input.foodType},
            ${input.quantity}, ${input.city}, ${input.area || null},
            ${input.isFresh}, 'available', ${safeUntil}, NOW()
          )
          RETURNING id, donor_name as "donorName", contact_number as "contactNumber",
                    food_type as "foodType", quantity, city, area, is_fresh as "isFresh",
                    status, safe_until as "safeUntil", created_at as "createdAt"
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
    console.error('donations handler error:', err?.message || err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
