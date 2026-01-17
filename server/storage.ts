import { db } from "./db";
import {
  donations,
  ngoRequests,
  foodRepository,
  type InsertDonation,
  type InsertNgoRequest,
  type Donation,
  type NgoRequest,
  type FoodRepository
} from "@shared/schema";
import { desc, eq, sql } from "drizzle-orm";

export interface IStorage {
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
  createNgoRequest(request: InsertNgoRequest): Promise<NgoRequest>;
  getNgoRequests(): Promise<NgoRequest[]>;
  getRepository(): Promise<FoodRepository[]>;
  updateRepository(city: string, foodType: string, donatedDelta: number, requestedDelta: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async updateRepository(city: string, foodType: string, donatedDelta: number, requestedDelta: number): Promise<void> {
    // This is a simplified version for a "repository" tracking. 
    // In a real app we might sum the tables, but here we'll use a summary table as requested.
    const existing = await db.select().from(foodRepository).where(
      sql`${foodRepository.city} = ${city} AND ${foodRepository.foodType} = ${foodType}`
    );

    if (existing.length === 0) {
      await db.insert(foodRepository).values({
        city,
        foodType,
        totalDonated: donatedDelta.toString(),
        totalRequested: requestedDelta.toString()
      });
    } else {
      await db.update(foodRepository)
        .set({
          totalDonated: sql`CAST(total_donated AS INTEGER) + ${donatedDelta}`,
          totalRequested: sql`CAST(total_requested AS INTEGER) + ${requestedDelta}`,
          updatedAt: new Date()
        })
        .where(eq(foodRepository.id, existing[0].id));
    }
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [newDonation] = await db
      .insert(donations)
      .values(donation)
      .returning();
    
    await this.updateRepository(donation.city, donation.foodType, 1, 0);
    return newDonation;
  }

  async getDonations(): Promise<Donation[]> {
    return await db
      .select()
      .from(donations)
      .orderBy(desc(donations.createdAt));
  }

  async createNgoRequest(request: InsertNgoRequest): Promise<NgoRequest> {
    const [newRequest] = await db
      .insert(ngoRequests)
      .values(request)
      .returning();
    
    // We'll treat requirements as a generic "Cooked" for the repository tracking unless specified
    await this.updateRepository(request.city, "Requested", 0, 1);
    return newRequest;
  }

  async getNgoRequests(): Promise<NgoRequest[]> {
    return await db
      .select()
      .from(ngoRequests)
      .orderBy(desc(ngoRequests.createdAt));
  }

  async getRepository(): Promise<FoodRepository[]> {
    return await db.select().from(foodRepository).orderBy(foodRepository.city);
  }
}

export const storage = new DatabaseStorage();
