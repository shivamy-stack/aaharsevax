import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const foodRepository = pgTable("food_repository", {
  id: serial("id").primaryKey(),
  foodType: text("food_type").notNull(),
  totalDonated: text("total_donated").notNull().default("0"),
  totalRequested: text("total_requested").notNull().default("0"),
  city: text("city").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  donorName: text("donor_name").notNull(),
  contactNumber: text("contact_number").notNull(),
  foodType: text("food_type").notNull(), // "Cooked" or "Packed"
  quantity: text("quantity").notNull(),
  city: text("city").notNull(), // Limited list selection
  area: text("area"),
  isFresh: boolean("is_fresh").notNull().default(true), // Confirms prepared within 2 hours
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ngoRequests = pgTable("ngo_requests", {
  id: serial("id").primaryKey(),
  ngoName: text("ngo_name").notNull(),
  contactNumber: text("contact_number").notNull(),
  requirements: text("requirements").notNull(),
  city: text("city").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertDonationSchema = createInsertSchema(donations).omit({ 
  id: true, 
  createdAt: true,
  status: true 
}).extend({
  isFresh: z.boolean().refine(val => val === true, {
    message: "You must confirm the food was prepared within the last two hours."
  }),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  city: z.enum(["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Other"]),
  foodType: z.enum(["Cooked", "Packed"])
});

export const insertNgoRequestSchema = createInsertSchema(ngoRequests).omit({ 
  id: true, 
  createdAt: true,
  status: true 
}).extend({
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  city: z.enum(["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Other"])
});

// === EXPLICIT API TYPES ===
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

export type NgoRequest = typeof ngoRequests.$inferSelect;
export type InsertNgoRequest = z.infer<typeof insertNgoRequestSchema>;
