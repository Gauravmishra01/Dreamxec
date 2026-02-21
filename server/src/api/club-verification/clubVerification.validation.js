const zod = require("zod");

const clubVerificationSchema = zod.object({
  body: zod.object({
    // -----------------------
    // EXISTING FIELDS (UNCHANGED)
    // -----------------------
    collegeName: zod.string().min(1, "College name is required"),
    studentEmail: zod.string().email("Invalid student email"),
    studentPhone: zod.string().min(5, "Invalid student phone"),
    presidentName: zod.string().min(1, "President name is required"),
    ficName: zod.string().min(1, "FIC name is required"),
    ficEmail: zod.string().email("Invalid FIC email"),
    ficPhone: zod.string().min(5, "Invalid FIC phone"),

    // -----------------------
    // CLUB DETAILS (NEW)
    // -----------------------
    clubName: zod.string().min(3, "Club name must be at least 3 characters"),
    clubDescription: zod
      .string()
      .min(30, "Club description must be at least 30 characters"),
    clubInstagram: zod.string().url("Invalid Instagram URL"),
    clubLinkedIn: zod.string().url("Invalid LinkedIn URL").optional().or(zod.literal("")),
    clubYouTube: zod.string().url("Invalid YouTube URL").optional().or(zod.literal("")),

    // -----------------------
    // ALUMNI (STRINGIFIED JSON)
    // -----------------------
    alumni: zod
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

module.exports = {
  clubVerificationSchema,
};
