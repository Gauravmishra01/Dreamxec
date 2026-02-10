const zod = require("zod");

const memberSchema = zod.object({
  email: zod.string().email(),
  name: zod.string().max(200).nullable().optional().or(zod.literal("")),
  phone: zod
    .string()
    .regex(/^[0-9+\-\s()]{6,20}$/)
    .nullable()
    .optional()
    .or(zod.literal("")),
});

const validateMembersPayload = (members) => {
  const schema = zod
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

module.exports = {
  validateMembersPayload,
};
