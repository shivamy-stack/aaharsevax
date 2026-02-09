import { insertDonationSchema } from "@shared/schema";
import { storage } from "../server/storage";

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "GET") {
      const results = await storage.getDonations();
      return res.status(200).json(results);
    }

    if (req.method === "POST") {
      try {
        const input = insertDonationSchema.parse(req.body);
        const donation = await storage.createDonation(input as any);
        return res.status(201).json(donation);
      } catch (err: any) {
        if (err?.issues) {
          // Zod error
          return res.status(400).json({ message: err.issues[0].message, field: err.issues[0].path.join('.') });
        }
        throw err;
      }
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err: any) {
    console.error('donations handler error', err);
    return res.status(500).json({ message: err?.message || 'Internal Server Error' });
  }
}
