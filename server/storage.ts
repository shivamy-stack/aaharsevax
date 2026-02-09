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

// If `db` is not available (e.g., no DATABASE_URL set), provide a
// lightweight in-memory fallback so the server and frontend can run
// without a configured Postgres instance. This is useful for testing
// and verifying deployment behavior on Vercel before wiring the DB.
class InMemoryStorage implements IStorage {
  private donations: Donation[] = [];
  private requests: NgoRequest[] = [];
  private donationId = 1;
  private requestId = 1;

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const id = this.donationId++;
    const createdAt = new Date();
    const safeUntil = donation.foodType === "Cooked" ? new Date(Date.now() + 4 * 60 * 60 * 1000) : null;
    const newDonation: any = {
      id,
      donorName: donation.donorName,
      contactNumber: donation.contactNumber,
      foodType: donation.foodType,
      quantity: donation.quantity,
      city: donation.city,
      area: (donation as any).area || null,
      isFresh: (donation as any).isFresh ?? true,
      status: "available",
      safeUntil,
      createdAt,
    };
    this.donations.unshift(newDonation);
    return newDonation as Donation;
  }

  async getDonations(): Promise<Donation[]> {
    return [...this.donations];
  }

  async getInventory(): Promise<Donation[]> {
    const now = new Date();
    return this.donations.filter(d => d.status === "available" && (!d.safeUntil || d.safeUntil > now));
  }

  async createNgoRequest(request: InsertNgoRequest): Promise<NgoRequest> {
    const id = this.requestId++;
    const createdAt = new Date();
    const newRequest: any = {
      id,
      ngoName: request.ngoName,
      contactNumber: request.contactNumber,
      requirements: request.requirements,
      city: request.city,
      status: "open",
      createdAt,
    };
    this.requests.unshift(newRequest);
    return newRequest as NgoRequest;
  }

  async getNgoRequests(): Promise<NgoRequest[]> {
    return [...this.requests];
  }
}

export const storage: IStorage = db ? new DatabaseStorage() : new InMemoryStorage();
