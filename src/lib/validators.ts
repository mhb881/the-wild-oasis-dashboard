import * as z from "zod";

export const CabinSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  maxCapacity: z.number(),
  regularPrice: z.number(),
  discount: z.number(),
  image: z.string(),
  description: z.string(),
  created_at: z.date(),
});

export const BookingSchema = z.object({
  id: z.number().optional(),
  startDate: z.date(),
  endDate: z.date(),
  numNights: z.number(),
  numGuests: z.number(),
  cabinPrice: z.number(),
  extraPrice: z.number(),
  totalPrice: z.number(),
  status: z.string(),
  hasBreakfast: z.boolean(),
  isPaid: z.boolean(),
  observations: z.string(),
  cabinId: z.number(),
  guestId: z.number(),
  created_at: z.date(),
});

export const GuestSchema = z.object({
  id: z.number().optional(),
  fullName: z.string(),
  email: z.string(),
  nationalID: z.string(),
  nationality: z.string(),
  countryFlag: z.string(),
  created_at: z.date(),
});

export const SettingSchema = z.object({
  id: z.number().optional(),
  minBookingLength: z.number(),
  maxBookingLength: z.number(),
  maxGuestsPerBooking: z.number(),
  breakfastPrice: z.number(),
  created_at: z.date(),
});
