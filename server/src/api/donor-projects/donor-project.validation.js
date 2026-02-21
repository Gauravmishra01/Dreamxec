const zod = require("zod");

const createDonorProjectSchema = zod.object({
  body: zod.object({
    title: zod.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
    description: zod.string().min(20, 'Description must be at least 20 characters'),
    organization: zod.string().optional(),
    skillsRequired: zod.array(zod.string()).optional(),
    timeline: zod.string().optional(),
    totalBudget: zod.number().positive('Total budget must be positive'),
    imageUrl: zod.string().url('Invalid URL').optional().or(zod.literal('')),
  }),
});

const updateDonorProjectSchema = zod.object({
  body: zod.object({
    title: zod.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long').optional(),
    description: zod.string().min(20, 'Description must be at least 20 characters').optional(),
    organization: zod.string().optional(),
    skillsRequired: zod.array(zod.string()).optional(),
    timeline: zod.string().optional(),
    totalBudget: zod.number().positive('Total budget must be positive').optional(),
    imageUrl: zod.string().url('Invalid URL').optional().or(zod.literal('')),
  }),
});

module.exports = {
  createDonorProjectSchema,
  updateDonorProjectSchema,
};
