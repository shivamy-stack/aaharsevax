import { db } from "./db";
import {
  donations,
  ngoRequests,
  type InsertDonation,
  type InsertNgoRequest,
  type Donation,
  type NgoRequest
} from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
  createNgoRequest(request: InsertNgoRequest): Promise<NgoRequest>;
  getNgoRequests(): Promise<NgoRequest[]>;
}

export class DatabaseStorage implements IStorage {
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [newDonation] = await db
      .insert(donations)
      .values(donation)
      .returning();
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
