import { db } from "./db";
import {
  donations,
  ngoRequests,
  type InsertDonation,
  type InsertNgoRequest,
  type Donation,
  type NgoRequest
} from "@shared/schema";
import { desc, eq, and, gt, or, isNull } from "drizzle-orm";

export interface IStorage {
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
  getInventory(): Promise<Donation[]>;
  createNgoRequest(request: InsertNgoRequest): Promise<NgoRequest>;
  getNgoRequests(): Promise<NgoRequest[]>;
}

export class DatabaseStorage implements IStorage {
  async createDonation(donation: InsertDonation): Promise<Donation> {
    // Set safeUntil to 4 hours from now by default if not provided
    const safeUntil = new Date();
    safeUntil.setHours(safeUntil.getHours() + 4);

    const [newDonation] = await db
      .insert(donations)
      .values({
        ...donation,
        status: "available",
        safeUntil: donation.foodType === "Cooked" ? safeUntil : null
      })
      .returning();
    
    return newDonation;
  }

  async getDonations(): Promise<Donation[]> {
    return await db
      .select()
      .from(donations)
      .orderBy(desc(donations.createdAt));
  }

  async getInventory(): Promise<Donation[]> {
    const now = new Date();
    return await db
      .select()
      .from(donations)
      .where(
        and(
          eq(donations.status, "available"),
          or(
            isNull(donations.safeUntil),
            gt(donations.safeUntil, now)
          )
        )
      )
      .orderBy(desc(donations.createdAt));
  }

  async createNgoRequest(request: InsertNgoRequest): Promise<NgoRequest> {
    const [newRequest] = await db
      .insert(ngoRequests)
      .values(request)
      .returning();
    
    return newRequest;
  }

  async getNgoRequests(): Promise<NgoRequest[]> {
    return await db
      .select()
      .from(ngoRequests)
      .orderBy(desc(ngoRequests.createdAt));
  }
}

export const storage = new DatabaseStorage();
