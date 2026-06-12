import { z } from "zod";

export const orderSchema = z.object({
  model: z.enum(["black-dragon", "white-dragon"], {
    error: "Please select a model.",
  }),
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  phone: z
    .string()
    .min(9, "Please enter a valid phone number.")
    .regex(/^[0-9+\s\-()]+$/, "Invalid phone number format."),
  email: z.string().email("Invalid email address.").optional().or(z.literal("")),
  city: z.string().min(2, "City is required."),
  address: z.string().min(5, "Please enter your full address."),
  notes: z.string().optional(),
});

export type OrderSchema = z.infer<typeof orderSchema>;

/** Checkout schema — multi-product with accessories and free-gift bundle logic */
export const checkoutSchema = z.object({
  fullName:             z.string().min(2, "Full name is required."),
  phone:                z.string().min(9, "Valid phone required.").regex(/^[0-9+\s\-()]+$/, "Invalid number."),
  city:                 z.string().min(2, "City is required."),
  address:              z.string().min(5, "Full address is required."),
  blackQty:             z.number().int().min(0).max(20),
  whiteQty:             z.number().int().min(0).max(20),
  accessories:          z.array(z.object({
    slug:        z.string(),
    databaseId:  z.number().int(),
    quantity:    z.number().int().min(0).max(20),
  })).default([]),
  hasBundle:            z.boolean().default(false),
  bundleGiftDatabaseId: z.number().int().nullable().optional(),
}).refine((d) => d.blackQty + d.whiteQty >= 1, {
  message: "At least one katana is required.",
  path:    ["blackQty"],
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
