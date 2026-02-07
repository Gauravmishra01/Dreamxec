const { z } = await import("zod");

export const verifyProjectSchema = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED'], {
      errorMap: () => ({ message: 'Status must be either APPROVED or REJECTED' }),
    }),
    reason: z.string().optional(),
  }),
});
