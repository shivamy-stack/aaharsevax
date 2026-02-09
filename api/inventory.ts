import { storage } from "../server/storage";

export default async function handler(_req: any, res: any) {
  try {
    const results = await storage.getInventory();
    return res.status(200).json(results);
  } catch (err: any) {
    console.error('inventory handler error', err);
    return res.status(500).json({ message: err?.message || 'Internal Server Error' });
  }
}
