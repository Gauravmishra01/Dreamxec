const zod = require("zod");

// Helper to auto-prepend https:// if missing
const sanitizeUrl = (val) => {
  if (typeof val === 'string' && val.length > 0 && !/^https?:\/\//i.test(val)) {
    return `https://${val}`;
  }
  return val;
};

const clubReferralSchema = zod.object({
  body: zod.object({
    clubName: zod.string().min(1, "Club Name is required"),
    collegeName: zod.string().min(1, "College Name is required"),
    
    // Contact Info
    presidentName: zod.string().min(1, "President Name is required"),
    presidentEmail: zod.string().email("Invalid President Email"),
    presidentPhone: zod.string().min(5, "President Phone is too short"),
    
    ficName: zod.string().min(1, "Faculty Name is required"),
    ficEmail: zod.string().email("Invalid Faculty Email"),
    ficPhone: zod.string().min(5, "Faculty Phone is too short"),

    // URL Fields with Preprocessing
    instagram: zod.preprocess(sanitizeUrl, zod.string().url("Invalid Instagram URL")),
    linkedIn: zod.preprocess(sanitizeUrl, zod.string().url("Invalid LinkedIn URL")),
    portfolio: zod.preprocess(sanitizeUrl, zod.string().url("Invalid Portfolio URL")),
  })
});

module.exports = {
  clubReferralSchema,
};
