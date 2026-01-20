const { z } = require("zod");

exports.clubVerificationSchema = z.object({
  body: z.object({
    // -----------------------
    // EXISTING FIELDS (UNCHANGED)
    // -----------------------
    collegeName: z.string().min(1, "College name is required"),
    studentEmail: z.string().email("Invalid student email"),
    studentPhone: z.string().min(5, "Invalid student phone"),
    presidentName: z.string().min(1, "President name is required"),
    ficName: z.string().min(1, "FIC name is required"),
    ficEmail: z.string().email("Invalid FIC email"),
    ficPhone: z.string().min(5, "Invalid FIC phone"),

    // -----------------------
    // CLUB DETAILS (NEW)
    // -----------------------
    clubName: z.string().min(3, "Club name must be at least 3 characters"),
    clubDescription: z
      .string()
      .min(30, "Club description must be at least 30 characters"),
    clubInstagram: z.string().url("Invalid Instagram URL"),
    clubLinkedIn: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    clubYouTube: z.string().url("Invalid YouTube URL").optional().or(z.literal("")),

    // -----------------------
    // ALUMNI (STRINGIFIED JSON)
    // -----------------------
    alumni: z
      .string()
      .refine((val) => {
        try {
          const parsed = JSON.parse(val);
          return (
            Array.isArray(parsed) &&
            parsed.length >= 1 &&
            parsed.every(
              (a) =>
                typeof a.name === "string" &&
                a.name.length > 0 &&
                typeof a.phone === "string" &&
                a.phone.length >= 5 &&
                (a.socialProfile === undefined ||
                  a.socialProfile === "" ||
                  /^https?:\/\//.test(a.socialProfile))
            )
          );
        } catch {
          return false;
        }
      }, "Invalid alumni data"),
  }),
});
