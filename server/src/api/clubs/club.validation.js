const { z } = await import("zod");

const memberSchema = z.object({
  email: z.string().email(),
  name: z.string().max(200).nullable().optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{6,20}$/)
    .nullable()
    .optional()
    .or(z.literal("")),
});

export const validateMembersPayload = (members) => {
  const schema = z
    .array(memberSchema)
    .min(1)
    .max(2000);

  try {
    const result = schema.parse(members); // throws on error
    return { value: result, error: null };
  } catch (err) {
    return {
      value: null,
      error: err.errors, // Zod standardized error format
    };
  }
};
