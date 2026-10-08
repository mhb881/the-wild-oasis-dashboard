import * as z from "zod";

import type {
  BookingSchema,
  CabinSchema,
  GuestSchema,
  SettingSchema,
} from "../lib/validators";

export type FilterMethod =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "like"
  | "ilike"
  | "is"
  | "in"
  | "cs"
  | "cd"
  | "sl"
  | "sr"
  | "nxl"
  | "nxr"
  | "adj"
  | "ovr"
  | "fts"
  | "plfts"
  | "phfts"
  | "wfts";

export type Cabin = z.infer<typeof CabinSchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type Guest = z.infer<typeof GuestSchema>;
export type Setting = z.infer<typeof SettingSchema>;

export type CabinInput = Omit<Cabin, "created_at" | "image"> & {
  image: FileList | string;
};

export type SettingInput = Omit<Setting, "created_at" | "id">;

export type ItemOfGetBookings = Booking & {
  cabins: {
    name: string;
  };
  guests: {
    fullName: string;
    email: string;
  };
};

//  最近预订统计项（仅包含销售额、杂费等字段）
export interface ItemOfGetBookingsAfterDate {
  created_at: string;
  totalPrice: number;
  extraPrice: number;
}

// （顺便把后面 useRecentStays 要用的住宿项也定义好）
export type ItemOfGetStaysAfterDate = Booking & {
  guests: {
    fullName: string;
  };
};
/**
 * .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
 */
export type ItemOfGetStaysTodayActivity = Booking & {
  guests: Pick<Guest, "fullName" | "nationality" | "countryFlag">;
};
/*
 guests: { fullName: guestName, email, country, countryFlag, nationalID },
    cabins: { name: cabinName },
 */
export type ItemOfGetBooking = Booking & {
  cabins: {
    name: string;
  };
  guests: {
    fullName: string;
    email: string;
    nationality: string;
    countryFlag: string;
    nationalID: string;
  };
};

export interface LoginObj {
  email: string;
  password: string;
}

export interface UserIdentity {
  id: string;
  identity_id: string;
  user_id: string;
  email: string;
  identity_data: {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    [key: string]: unknown;
  };
  provider: string;
  last_sign_in_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserFromSupabase {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string | null;
  phone: string;
  phone_confirmed_at: string | null;
  confirmed_at: string | null;
  last_sign_in_at: string | null;
  app_metadata: {
    provider?: string;
    providers?: string[];
    [key: string]: unknown;
  };
  user_metadata: {
    username?: string;
    avatar?: string;
    [key: string]: unknown;
  };
  identities: UserIdentity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

export interface UpdateUserDataFormInput {
  username: string;
  email: string;
  avatar?: FileList;
  password: string;
  confirmPassword: string;
}
