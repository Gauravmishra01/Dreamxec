import { z } from "zod";

// Helper to auto-prepend https:// if missing
const sanitizeUrl = (val) => {
  if (typeof val === 'string' && val.length > 0 && !/^https?:\/\//i.test(val)) {
    return `https://${val}`;
  }
  return val;
};

export const clubReferralSchema = z.object({
  body: z.object({
    clubName: z.string().min(1, "Club Name is required"),
    collegeName: z.string().min(1, "College Name is required"),
    
    // Contact Info
    presidentName: z.string().min(1, "President Name is required"),
    presidentEmail: z.string().email("Invalid President Email"),
    presidentPhone: z.string().min(5, "President Phone is too short"),
    
    ficName: z.string().min(1, "Faculty Name is required"),
    ficEmail: z.string().email("Invalid Faculty Email"),
    ficPhone: z.string().min(5, "Faculty Phone is too short"),

    // URL Fields with Preprocessing
    instagram: z.preprocess(sanitizeUrl, z.string().url("Invalid Instagram URL")),
    linkedIn: z.preprocess(sanitizeUrl, z.string().url("Invalid LinkedIn URL")),
    portfolio: z.preprocess(sanitizeUrl, z.string().url("Invalid Portfolio URL")),
  })
});