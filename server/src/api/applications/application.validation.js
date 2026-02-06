import { z } from 'zod';

export const applyToDonorProjectSchema = z.object({
  body: z.object({
    donorProjectId: z.string().min(1, 'Donor project ID is required'),
    coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
    skills: z.array(z.string()).optional(),
  }),
});

export const updateApplicationStatusSchema = z.object({
  body: z.object({
    status: z.enum(['ACCEPTED', 'REJECTED'], {
      errorMap: () => ({ message: 'Status must be ACCEPTED or REJECTED' }),
    }),
    rejectionReason: z.string().optional(),
  }),
});
