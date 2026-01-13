const { z } = require("zod");

exports.clubReferralSchema = z.object({
  body: z.object({
    clubName: z.string().min(1),
    collegeName: z.string().min(1),
    presidentEmail: z.string().email(),
    presidentPhone: z.string().min(5),
    presidentName: z.string().min(1),
    ficEmail: z.string().email(),
    ficPhone: z.string().min(5),
    ficName: z.string().min(1),
    instagram: z.string().url(),
    linkedIn: z.string().url(),
    portfolio: z.string().url()
  })
});
