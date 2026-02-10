const zod = require("zod");

const verifyProjectSchema = zod.object({
  body: zod.object({
    status: zod.enum(['APPROVED', 'REJECTED'], {
      errorMap: () => ({ message: 'Status must be either APPROVED or REJECTED' }),
    }),
    reason: zod.string().optional(),
  }),
});

module.exports = {
  verifyProjectSchema,
};
