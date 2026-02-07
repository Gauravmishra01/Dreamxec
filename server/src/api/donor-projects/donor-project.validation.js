const { z } = await import("zod");

export const createDonorProjectSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    organization: z.string().optional(),
    skillsRequired: z.array(z.string()).optional(),
    timeline: z.string().optional(),
    totalBudget: z.number().positive('Total budget must be positive'),
    imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  }),
});

export const updateDonorProjectSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long').optional(),
    description: z.string().min(20, 'Description must be at least 20 characters').optional(),
    organization: z.string().optional(),
    skillsRequired: z.array(z.string()).optional(),
    timeline: z.string().optional(),
    totalBudget: z.number().positive('Total budget must be positive').optional(),
    imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  }),
});
