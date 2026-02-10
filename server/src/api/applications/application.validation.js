const zod = require("zod");

const applyToDonorProjectSchema = zod.object({
  body: zod.object({
    donorProjectId: zod.string().min(1, 'Donor project ID is required'),
    coverLetter: zod.string().min(50, 'Cover letter must be at least 50 characters'),
    skills: zod.array(zod.string()).optional(),
  }),
});

const updateApplicationStatusSchema = zod.object({
  body: zod.object({
    status: zod.enum(['ACCEPTED', 'REJECTED'], {
      errorMap: () => ({ message: 'Status must be ACCEPTED or REJECTED' }),
    }),
    rejectionReason: zod.string().optional(),
  }),
});

module.exports = {
  applyToDonorProjectSchema,
  updateApplicationStatusSchema,
};
